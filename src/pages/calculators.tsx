import React from 'react';

import Layout from 'components/Layout';
import SEO from 'components/SEO';
import HeroBanner from 'components/HeroBanner';

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Real Estate Calculators" />
      List of Real Estate Calculators
      <hr />
    </Layout>
  );
};

export default IndexPage;
