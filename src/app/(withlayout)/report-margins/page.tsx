"use client";

import React from "react";
import {
  Panel,
  Form,
  InputNumber,
  Button,
  ButtonToolbar,
  Divider,
  Placeholder,
  useToaster,
  Message,
  ButtonGroup,
  Tooltip,
  Whisper,
  Schema,
} from "rsuite";
import { Save, X, Link as LinkIcon, Link2Off, RotateCw } from "lucide-react";
import {
  useLazyGetReportMarginQuery,
  usePostReportMarginMutation,
} from "@/redux/api/reportMargin/reportMargin.api";

export type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type MarginPageProps = {
  /** Your own Router.push (or similar) can be passed here */
  onCancel?: () => void;
  /** Called after a successful save */
  onSaved?: (margins: Margins) => void;
  /** Start with all sides linked */
  initialLockUniform?: boolean;
};

const { NumberType } = Schema.Types;
const model = Schema.Model({
  top: NumberType().isRequired("Required").min(0, "≥ 0").max(500, "≤ 500"),
  right: NumberType().isRequired("Required").min(0, "≥ 0").max(500, "≤ 500"),
  bottom: NumberType().isRequired("Required").min(0, "≥ 0").max(500, "≤ 500"),
  left: NumberType().isRequired("Required").min(0, "≥ 0").max(500, "≤ 500"),
});

const MarginSettingsForm = () => {
  const [post] = usePostReportMarginMutation();
  const [fetch] = useLazyGetReportMarginQuery();

  const toaster = useToaster();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uniform, setUniform] = React.useState(false);
  const [formValue, setFormValue] = React.useState<Margins>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [loadedValue, setLoadedValue] = React.useState<Margins | null>(null);
  const formRef = React.useRef<any>(null);

  const isDirty = React.useMemo(() => {
    if (!loadedValue) return false;
    return JSON.stringify(formValue) !== JSON.stringify(loadedValue);
  }, [formValue, loadedValue]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const existing = await fetch(undefined).unwrap();

        if (!cancelled) {
          if (existing?.data?.length) {
            setFormValue(existing?.data?.[0]);
            setLoadedValue(existing?.data?.[0]);
          } else {
            // Keep defaults
            setLoadedValue({ top: 0, right: 0, bottom: 0, left: 0 });
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          toaster.push(
            <Message showIcon type="error" closable>
              {err?.message || "Failed to load margins"}
            </Message>,
            { placement: "topEnd" }
          );
          setLoadedValue({ top: 0, right: 0, bottom: 0, left: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toaster]);

  const updateField = React.useCallback(
    (field: keyof Margins, value?: number | null) => {
      const v = typeof value === "number" ? value : 0;
      setFormValue((prev) =>
        uniform
          ? { top: v, right: v, bottom: v, left: v }
          : { ...prev, [field]: v }
      );
    },
    [uniform]
  );

  const handleSave = React.useCallback(async () => {
    const valid = await formRef.current?.check?.();
    if (!valid) {
      toaster.push(
        <Message showIcon type="warning" closable>
          Fix validation errors before saving.
        </Message>,
        { placement: "topEnd" }
      );
      return;
    }

    try {
      setSaving(true);
      const result = await post(formValue).unwrap();
      setLoadedValue(formValue);
      toaster.push(
        <Message showIcon type="success" closable>
          Saved successfully.
        </Message>,
        { placement: "topEnd" }
      );
    } catch (err: any) {
      toaster.push(
        <Message showIcon type="error" closable>
          {err?.message || "Failed to save margins"}
        </Message>,
        { placement: "topEnd" }
      );
    } finally {
      setSaving(false);
    }
  }, [formValue, toaster]);

  const handleReset = React.useCallback(() => {
    if (loadedValue) setFormValue(loadedValue);
  }, [loadedValue]);

  const formValueHandler = (v: Record<string, number>) => {
    const toNumberValues = (o: Record<string, number>) =>
      Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number(v)]));

    const result = toNumberValues(v);
    setFormValue(result as Margins);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Panel bordered className="rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Report Margins</h2>
          <ButtonGroup size="sm" className="!gap-2">
            <Whisper
              placement="bottom"
              speaker={
                <Tooltip>{uniform ? "Unlink sides" : "Link all sides"}</Tooltip>
              }
            >
              <Button
                appearance="subtle"
                onClick={() => setUniform((u) => !u)}
                startIcon={
                  uniform ? <LinkIcon size={16} /> : <Link2Off size={16} />
                }
              >
                {uniform ? "Linked" : "Unlinked"}
              </Button>
            </Whisper>
            {/* <Whisper
              placement="bottom"
              speaker={<Tooltip>Reset to last saved</Tooltip>}
            >
              <Button
                appearance="subtle"
                onClick={handleReset}
                startIcon={<RotateCw size={16} />}
              >
                Reset
              </Button>
            </Whisper> */}
          </ButtonGroup>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Placeholder.Paragraph rows={2} active />
            <Placeholder.Paragraph rows={2} active />
            <Placeholder.Paragraph rows={1} active />
          </div>
        ) : (
          <Form
            ref={formRef}
            fluid
            formValue={formValue}
            model={model}
            onChange={formValueHandler}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Group controlId="top">
                <Form.ControlLabel>Top (in)</Form.ControlLabel>
                <Form.Control
                  name="top"
                  accepter={InputNumber}
                  step={0.5}
                  min={0}
                  max={500}
                  value={formValue.top}
                  //   onChange={(v) => updateField("top", v)}
                  placeholder="e.g., 20"
                  type="number"
                />
              </Form.Group>

              <Form.Group controlId="right">
                <Form.ControlLabel>Right (in)</Form.ControlLabel>
                <Form.Control
                  name="right"
                  accepter={InputNumber}
                  step={0.5}
                  min={0}
                  max={500}
                  value={formValue.right}
                  //   onChange={(v) => updateField("right", v)}
                  placeholder="e.g., 20"
                  type="number"
                />
              </Form.Group>

              <Form.Group controlId="bottom">
                <Form.ControlLabel>Bottom (in)</Form.ControlLabel>
                <Form.Control
                  name="bottom"
                  accepter={InputNumber}
                  step={0.5}
                  min={0}
                  max={500}
                  value={formValue.bottom}
                  //   onChange={(v) => updateField("bottom", v)}
                  placeholder="e.g., 20"
                  type="number"
                />
              </Form.Group>

              <Form.Group controlId="left">
                <Form.ControlLabel>Left (in)</Form.ControlLabel>
                <Form.Control
                  name="left"
                  accepter={InputNumber}
                  step={0.5}
                  min={0}
                  max={500}
                  value={formValue.left}
                  //   onChange={(v) => updateField("left", v)}
                  placeholder="e.g., 20"
                  type="number"
                />
              </Form.Group>
            </div>

            <Divider className="!my-6" />

            <div className="flex justify-end">
              <ButtonToolbar className="flex gap-2">
                <Button
                  appearance="ghost"
                  // onClick={onCancel}
                  startIcon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  onClick={handleSave}
                  loading={saving}
                  disabled={!loadedValue || saving || !isDirty}
                  startIcon={<Save size={16} />}
                >
                  Save
                </Button>
              </ButtonToolbar>
            </div>
          </Form>
        )}
      </Panel>
    </div>
  );
};

export default MarginSettingsForm;
