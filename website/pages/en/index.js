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
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
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
            <Button href={docUrl('ticket-api')}>Documentation</Button>
            <Button href="https://github.com/socialhub/socialhub-dev/edit/master/swagger.yaml">API Reference</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

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
            title: 'Try it Out',
            content: 'Assuming you already have a SocialHub account, you need to request access to the Inbox API by contacting us at happy@socialhub.io with a short explanation. You\'ll then be able to create a Custom Channel via your account\'s Channels Settings Page. During the creation your Channel will be assigned an Access Token that you can use for accessing the SocialHub Inbox API.',
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
            title: 'Learn How',
            content: 'The SocialHub APIs allow customers to extend our products with additional functionality. The HTTP REST APIs allow to execute read, create, update and delete operations on SocialHub data restricted to specific channels. The HTTP WebHook system allows subscribing to events happening on SocialHub and receiving them in real time. Take a look at the documentation to find out more.',
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
            title: 'Create Tickets',
            content: 'Use the SocialHub Inbox API to create Tickets for Custom Channels.',
            image: `${baseUrl}img/custom-ticket.png`,
            imageAlign: 'top',
          },
          {
            title: 'Receive Replies',
            content: 'Set up a WebHook and receive replies made to your Tickets.',
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
