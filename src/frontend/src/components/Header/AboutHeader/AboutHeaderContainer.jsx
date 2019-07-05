// @flow
import React, { PureComponent } from 'react';
import { AboutHeaderComponent } from './AboutHeaderComponent';

type Props = {};

const sectionLabel = 'FAQ';

class AboutHeaderContainer extends PureComponent<Props> {
  render() {
    return <AboutHeaderComponent sectionLabel={sectionLabel} />;
  }
}

export const AboutHeader = AboutHeaderContainer;
