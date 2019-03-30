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
      content: 'We use our APIs ourselves and try to document everything on this website. Maybe you want to have another look at the documentation?',
      title: 'Browse Docs',
    },
    {
      content: 'Share your questions at <a href="https://stackoverflow.com/questions/tagged/socialhub">Stack Overflow</a> where the SocialHub developers and others like you will try to help. Please consider subscribing to the socialhub tag yourself to join the SocialHub developers community.',
      title: 'Join the community',
    },
    {
      content: 'Got a specific question that is not answered by the documentation and doesn\'t belong on Stack Overflow? Feel free to contact our support via email at support@socialhub.io',
      title: 'Contact support',
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
