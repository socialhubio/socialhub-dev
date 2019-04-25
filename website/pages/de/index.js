/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        SocialHub für Entwickler
        <small>Dokumentation und API Referenz</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('api')}>Dokumentation</Button>
            <Button href="https://petstore.swagger.io/?url=https://raw.githubusercontent.com/socialhubio/socialhub-dev/master/swagger.yaml">API Referenz</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            title: 'Ausprobieren',
            content: 'Wenn Du bereits einen SocialHub Account hast, kann der Zugriff auf die Inbox API über eine kurze Nachricht an happy@socialhub.io beantragt werden. Danach ist es möglich einen API-Kanal über die Kanal-Einstellungen deines Accounts zu erstellen. Bei der Erstellung wird diesem Kanal ein Zugriffs-Schlüssel (Access Token) zugewiesen, mit welchem man auf die SocialHub Inbox API zugreifen kann.',
            image: `${baseUrl}img/custom-channel.png`,
            imageAlign: 'left',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            title: 'SocialHub Schnittstelle',
            content: `Die SocialHub API erlaubt unsere Produkte mit zusätzlichen Funktionen zu erweitern. Sie ermöglicht die Integration von Daten-Quellen, wie Sozialen Netzwerken, die noch nicht offiziell von SocialHub unterstützt werden. Der Fantasie sind hier wenige Grenzen gesetzt: Sofern maschinen-lesbarer Zugriff auf die Daten besteht, lassen diese sich auch zur Integration nutzen.<br/><br/>Mehr dazu in unserer <a href="${docUrl('api')}">Dokumentation</a>.`,
            image: `${baseUrl}img/curl-ticket-creation.png`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            title: 'Tickets erstellen',
            content: 'Nutze die SocialHub Inbox API um Tickets für API-Kanäle (Custom Channels) zu erstellen.',
            image: `${baseUrl}img/custom-ticket.png`,
            imageAlign: 'top',
          },
          {
            title: 'Antworten erhalten',
            content: 'Registriere einen WebHook und erhalte Antworten auf deine Tickets.',
            image: `${baseUrl}img/custom-ticket-reply.png`,
            imageAlign: 'top',
          },
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <LearnHow />
          <TryOut />
        </div>
      </div>
    );
  }
}

module.exports = Index;
