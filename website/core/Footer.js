/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Resources</h5>
            <a target="_blank" rel="noreferrer noopener" href="https://github.com/socialhubio">GitHub</a>
            <a target="_blank" rel="noreferrer noopener" href="https://socialhubio.zendesk.com/hc/">Zendesk User Manual</a>
            <a target="_blank" rel="noreferrer noopener" href="https://www.youtube.com/channel/UCbiyPSSFWhvWoTDS5VKxZiQ">YouTube Channel</a>
          </div>
          <div>
            <h5>Community</h5>
            <a target="_blank" rel="noreferrer noopener" href="https://stackoverflow.com/questions/tagged/socialhub">Stack Overflow</a>
            <a target="_blank" rel="noreferrer noopener" href="https://www.facebook.com/groups/210910185757909/">Facebook Usergroup</a>
            <a target="_blank" rel="noreferrer noopener" href="http://community.socialhub.io/forums/231869-socialhub-feature-community">Feature Community</a>
          </div>
          <div>
            <h5>SocialHub</h5>
            <a target="_blank" rel="noreferrer noopener" href="https://socialhub.io/">Website</a>
            <a target="_blank" rel="noreferrer noopener" href="https://socialhub.io/int/imprint/">Imprint (int)</a>
            <a target="_blank" rel="noreferrer noopener" href="https://socialhub.io/de/legal/imprint/">Impressum (de)</a>
          </div>
        </section>

        <a
          href="https://opensource.facebook.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/socialhub.svg`}
            alt="SocialHub"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
