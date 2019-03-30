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
      content: 'Auch wir nutzen unsere APIs und versuchen auf dieser Webseite alles zu dokumentieren. Vielleicht nochmal einen Blick in die Dokumentation werfen?',
      title: 'Dokumentation',
    },
    {
      content: 'Teile deine Frage auf <a href="https://stackoverflow.com/questions/tagged/socialhub">Stack Overflow</a> wo SocialHub Entwickler und andere wie Du selbst, versuchen werden zu helfen. Werde Teil unserer Entwickler Gemeinschaft und helfe mit, indem Du dem socialhub Tag auf Stack Overflow folgst.',
      title: 'Entwickler Gemeinschaft',
    },
    {
      content: 'Du hast eine spezifische Frage die nicht durch die Dokumentation geklärt wird und auch nicht zu Stack Overflow passt? Dann kontaktiere uns via E-Mail bei support@socialhub.io',
      title: 'Kontaktiere den Support',
    },
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Hilfe benötigt?</h1>
          </header>
          <p>Hier wird Dir geholfen:</p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
