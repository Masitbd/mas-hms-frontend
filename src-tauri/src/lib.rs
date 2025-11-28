use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{Manager, Runtime, WindowEvent};
use tauri_plugin_shell::{process::CommandChild, process::CommandEvent, ShellExt};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SidecarConfig {
    pub name: String,
    pub env_vars: HashMap<String, String>,
}

#[derive(Default)]
struct AppState {
    sidecars: Mutex<HashMap<String, CommandChild>>,
    configs: Mutex<HashMap<String, SidecarConfig>>,
    restarting: Mutex<bool>, // <--- NEW
}

// Start multiple sidecars with dynamic configuration
fn start_sidecars<R: Runtime>(app: &tauri::AppHandle<R>, configs: Vec<SidecarConfig>) {
    for config in configs {
        match start_single_sidecar(app, config.clone()) {
            Ok(_) => log::info!("Successfully started sidecar: {}", config.name),
            Err(e) => log::error!("Failed to start sidecar '{}': {}", config.name, e),
        }
    }
}

fn restart_all_sidecars<R: Runtime>(app: &tauri::AppHandle<R>) {
    let state: tauri::State<AppState> = app.state();

    // --- guard: if already restarting, just ignore extra triggers ---
    {
        let mut restarting = state.restarting.lock().unwrap();
        if *restarting {
            log::warn!("Restart already in progress, ignoring extra trigger");
            return;
        }
        *restarting = true;
    }

    log::warn!("Restarting all sidecars...");

    // Snapshot configs
    let configs: Vec<SidecarConfig> = {
        let cfgs = state.configs.lock().unwrap();
        cfgs.values().cloned().collect()
    };

    // Kill whatever is running
    stop_all_sidecars(app);

    // Start again
    start_sidecars(app, configs);

    // Reset guard
    {
        let mut restarting = state.restarting.lock().unwrap();
        *restarting = false;
    }
}
// Start a single sidecar
fn start_single_sidecar<R: Runtime>(
    app: &tauri::AppHandle<R>,
    config: SidecarConfig,
) -> Result<(), String> {
    let mut cmd = app
        .shell()
        .sidecar(&config.name)
        .map_err(|e| format!("Failed to create sidecar command: {}", e))?;

    for (key, value) in config.env_vars.iter() {
        cmd = cmd.env(key, value);
    }

    let (mut rx, child) = cmd
        .spawn()
        .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;

    let state: tauri::State<AppState> = app.state();
    state
        .sidecars
        .lock()
        .unwrap()
        .insert(config.name.clone(), child);

    let sidecar_name = config.name.clone();
    let app_handle = app.clone();

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    log::info!(
                        "[{}] stdout: {}",
                        sidecar_name,
                        String::from_utf8_lossy(&line)
                    );
                }
                CommandEvent::Stderr(line) => {
                    log::error!(
                        "[{}] stderr: {}",
                        sidecar_name,
                        String::from_utf8_lossy(&line)
                    );
                }
                CommandEvent::Error(err) => {
                    log::error!("[{}] error: {}", sidecar_name, err);
                    // restart_all_sidecars(&app_handle);
                    break;
                }
                CommandEvent::Terminated(payload) => {
                    log::warn!("[{}] terminated: {:?}", sidecar_name, payload);
                    // restart_all_sidecars(&app_handle);
                    break;
                }
                _ => {}
            }
        }
    });

    Ok(())
}

// Kill a specific sidecar by name
fn stop_sidecar<R: Runtime>(app: &tauri::AppHandle<R>, sidecar_name: &str) -> Result<(), String> {
    let state: tauri::State<AppState> = app.state();

    let maybe_child = {
        let mut guard = state.sidecars.lock().unwrap();
        guard.remove(sidecar_name)
    };

    if let Some(child) = maybe_child {
        child
            .kill()
            .map_err(|e| format!("Failed to kill sidecar: {}", e))?;
        log::info!("Stopped sidecar: {}", sidecar_name);
        Ok(())
    } else {
        Err(format!("Sidecar '{}' not found", sidecar_name))
    }
}

// Kill all running sidecars
fn stop_all_sidecars<R: Runtime>(app: &tauri::AppHandle<R>) {
    let state: tauri::State<AppState> = app.state();

    let sidecars = {
        let mut guard = state.sidecars.lock().unwrap();
        std::mem::take(&mut *guard) // Take all sidecars
    };

    for (name, child) in sidecars {
        if let Err(e) = child.kill() {
            log::error!("Failed to kill sidecar '{}': {}", name, e);
        } else {
            log::info!("Stopped sidecar: {}", name);
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .manage(AppState::default())
        .setup(|app| {
            let handle = app.handle().clone();

            let sidecar_configs = vec![
                // Sidecar 1: Main Server
                SidecarConfig {
                    name: "my-server".to_string(),
                    env_vars: {
                        let mut env = HashMap::new();
                        env.insert(
                            "DEV_DATABASE_URL".to_string(),
                            "mongodb://192.168.1.50:27017/HMS_NDMC".to_string(),
                        );
                        env.insert("PORT".to_string(), "3002".to_string());
                        env.insert("DEFAULT_USER_PASS".to_string(), "12345".to_string());
                        env.insert("BCRYPT_SALT_ROUNDS".to_string(), "10".to_string());
                        env.insert("JWT_SECRET".to_string(), "your_jwt_secret".to_string());
                        env.insert(
                            "JWT_REFRESH_SECRET".to_string(),
                            "your_jwt_refresh_secret".to_string(),
                        );
                        env.insert("JWT_EXPIRES_IN".to_string(), "1d".to_string());
                        env.insert("JWT_REFRESH_EXPIRES_IN".to_string(), "7d".to_string());
                        env.insert(
                            "REDIS_URL".to_string(),
                            "redis://localhost:6379".to_string(),
                        );
                        env.insert("REDIS_TOKEN_EXPIRES_IN".to_string(), "3600".to_string());
                        env.insert(
                            "RESET_PASS_UI_LINK".to_string(),
                            "http://148.135.137.151:3000/reset-password".to_string(),
                        );
                        env.insert("EMAIL".to_string(), "ndmc@smtrustbd.com".to_string());
                        env.insert("APP_PASS".to_string(), "r3@BAkttDFGVBTW".to_string());
                        env.insert(
                            "SUPER_ADMIN_EMAIL".to_string(),
                            "ndmc@smtrustbd.com".to_string(),
                        );
                        env.insert("SUPER_ADMIN_AGE".to_string(), "24".to_string());
                        env.insert(
                            "SUPER_ADMIN_DATE_OF_BIRTH".to_string(),
                            "01/01/2000".to_string(),
                        );
                        env.insert("SUPER_ADMIN_GENDER".to_string(), "male".to_string());
                        env
                    },
                },
                // Sidecar 3: Third Service
                SidecarConfig {
                    name: "auth".to_string(),
                    env_vars: {
                        let mut env = HashMap::new();
                        env.insert(
                            "DATABASE_URL".to_string(),
                            "mongodb://192.168.1.50:27017/HMS_NDMC".to_string(),
                        );
                        env.insert("PORT".to_string(), "3003".to_string());
                        env.insert("NODE_ENV".to_string(), "production".to_string());
                        env.insert("DEFAULT_USER_PASS".to_string(), "12345".to_string());
                        env.insert("BCRYPT_SALT_ROUNDS".to_string(), "10".to_string());
                        env.insert("JWT_SECRET".to_string(), "your_jwt_secret".to_string());
                        env.insert(
                            "JWT_REFRESH_SECRET".to_string(),
                            "your_jwt_refresh_secret".to_string(),
                        );
                        env.insert("JWT_EXPIRES_IN".to_string(), "1d".to_string());
                        env.insert("JWT_REFRESH_EXPIRES_IN".to_string(), "7d".to_string());
                        env.insert(
                            "REDIS_URL".to_string(),
                            "redis://localhost:6379".to_string(),
                        );
                        env.insert("REDIS_TOKEN_EXPIRES_IN".to_string(), "3600".to_string());
                        env.insert(
                            "RESET_PASS_UI_LINK".to_string(),
                            "http://148.135.137.151:3000/reset-password".to_string(),
                        );
                        env.insert("EMAIL".to_string(), "ndmc@smtrustbd.com".to_string());
                        env.insert("APP_PASS".to_string(), "r3@BAkttDFGVBTW".to_string());
                        env.insert(
                            "SUPER_ADMIN_EMAIL".to_string(),
                            "ndmc@smtrustbd.com".to_string(),
                        );
                        env.insert("SUPER_ADMIN_AGE".to_string(), "24".to_string());
                        env.insert(
                            "SUPER_ADMIN_DATE_OF_BIRTH".to_string(),
                            "01/01/2000".to_string(),
                        );
                        env.insert("SUPER_ADMIN_GENDER".to_string(), "male".to_string());
                        env
                    },
                },
                // Sidecar 2: Another Service
                SidecarConfig {
                    name: "api-gateway".to_string(),
                    env_vars: {
                        let mut env = HashMap::new();
                        env.insert(
                            "DATABASE_URL".to_string(),
                            "mongodb://192.168.1.50:27017/HMS_NDMC".to_string(),
                        );
                        env.insert("PORT".to_string(), "3001".to_string());
                        env.insert("NODE_ENV".to_string(), "production".to_string());
                        env.insert("JWT_SECRET".to_string(), "your_jwt_secret".to_string());
                        env.insert(
                            "JWT_REFRESH_SECRET".to_string(),
                            "your_jwt_refresh_secret".to_string(),
                        );
                        env.insert("CLOUDINARY_API_SECRET".to_string(), "44445455".to_string());
                        env.insert("CLOUDINARY_CLOUD_NAME".to_string(), "547".to_string());
                        env.insert("PAYMENT_SERVICE_URL".to_string(), "4".to_string());
                        env.insert("REDIS_URL".to_string(), "SOMES".to_string());
                        env.insert(
                            "AUTH_SERVICE_URL".to_string(),
                            "http://localhost:3003/api/v1".to_string(),
                        );
                        env.insert(
                            "CORE_SERVICE_URL".to_string(),
                            "http://localhost:3002/api/v1".to_string(),
                        );
                        env.insert(
                            "ACCOUNT_SERVICE_URL".to_string(),
                            "http://localhost:3006/api/v1".to_string(),
                        );
                        env.insert(
                            "INDOOR_SERVICE_URL".to_string(),
                            "http://localhost:3007/api/v1".to_string(),
                        );
                        env.insert("FRONTEND_PRODUCTION_URL".to_string(), "*".to_string());
                        env.insert("FRONTEND_DEV_URL".to_string(), "*".to_string());
                        env.insert(
                            "CLOUDINARY_API_KEY".to_string(),
                            "2e440ddfbb78d5330c419783d3cc88fc".to_string(),
                        );

                        env
                    },
                },
            ];
            {
                let state: tauri::State<AppState> = app.state();
                let mut cfgs = state.configs.lock().unwrap();
                for cfg in sidecar_configs.iter().cloned() {
                    cfgs.insert(cfg.name.clone(), cfg);
                }
            }

            // (Optional but recommended) Kill leftover sidecars from previous run
            stop_all_sidecars(&handle);

            // Start all sidecars
            start_sidecars(&handle, sidecar_configs);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { .. } = event {
                // Only stop sidecars when the MAIN window is closing
                if window.label() == "main" {
                    stop_all_sidecars(&window.app_handle());
                } else {
                    log::info!(
                        "Window '{}' closed, leaving sidecars running",
                        window.label()
                    );
                }
            }
        })
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
