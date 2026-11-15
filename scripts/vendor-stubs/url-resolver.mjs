// Replaces pdfmake's URLResolver, which downloads http(s) images and fonts
// named in a document definition. The exporter embeds only its own fonts and
// never names a remote resource, so no network code ships in the vendored
// modules. A remote URL fails loudly instead of being fetched.
export default class URLResolver {
  setUrlAccessPolicy() {}

  resolve(url) {
    if (/^https?:\/\//i.test(String(url))) {
      return Promise.reject(new Error(`Remote resources are not supported by the document exporter: ${url}`));
    }
    return Promise.resolve();
  }

  resolved() {
    return Promise.resolve();
  }
}
