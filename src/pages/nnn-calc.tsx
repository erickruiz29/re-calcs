import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import HeroBanner from 'components/HeroBanner';
import NnnCalculator from "../components/NnnCalculator";

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="NNN Calculator" />
        <NnnCalculator calcName={"NNN Calculator"}></NnnCalculator>
      <hr />
    </Layout>
  );
};

export default IndexPage;
