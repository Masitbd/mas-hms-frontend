import { Footer as RsuiteFooter, Grid, Row, Col } from "rsuite";

export const Footer = () => {
  return (
    <RsuiteFooter>
      <Grid>
        <Row>
          <Col xs={24} sm={12}>
            {/* Left side of the footer */}
            <p>&copy; MASITBD</p>
          </Col>
          <Col xs={24} sm={12}>
            {/* Right side of the footer */}
            <div style={{ textAlign: "right" }}>
              <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
            </div>
          </Col>
        </Row>
      </Grid>
    </RsuiteFooter>
  );
};
