/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: 'Is anything unclear or missing in the documentation? Consider asking documentation related questions or suggestions for improvement on our <a href="https://github.com/socialhubio/socialhub-dev/">GitHub Repository</a>',
      title: '1. Help improving the Docs',
    },
    {
      content: 'Share your questions at <a href="https://stackoverflow.com/questions/tagged/socialhub">Stack Overflow</a> where the SocialHub developers and others like you will try to help. Please consider subscribing to the socialhub tag yourself to join the SocialHub developers community.',
      title: '2. Developer Community',
    },
    {
      content: 'If you want to report something that requires confidentiality because it contains customer data or is an security issue, please write us at support@socialhub.io',
      title: '3. Contact support',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <p>Here's where you can get it:</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
