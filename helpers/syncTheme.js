export const syncFavicon = () => {
  document.querySelector("link[rel~='icon']").href =
    "https://vn.tradingview.com/static/images/favicon.ico"
}
