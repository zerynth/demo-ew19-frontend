import React from 'react';
import PropTypes from 'prop-types';

import {
  Columns,
  Section,
  Container,
} from 'react-bulma-components';

const LayoutWithSidebar = ({
  left,
  children,
}) => (
  <Container fluid>
    <Columns className="is-fullheight" multiline={false}>
      <Section className="column is-narrow is-narrow-mobile is-fullheight is-hidden-mobile">
        { left }
      </Section>

      <div className="column">
        { children }
      </div>
    </Columns>
  </Container>
);

LayoutWithSidebar.propTypes = {
  // sidebar
  left: PropTypes.node.isRequired,
  // main column
  children: PropTypes.node,
};

LayoutWithSidebar.defaultProps = {
  children: null,
};

export default LayoutWithSidebar;
