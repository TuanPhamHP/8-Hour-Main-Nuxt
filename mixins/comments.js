// import { tStr } from "validation_t/src"
export default {
  methods: {
    parseCommentText(_txt) {
      if (!_txt || !String(_txt).trim()) {
        return ""
      }
      const sTxt = String(_txt)
      if (sTxt.includes(`<mention `)) {
        const div = document.createElement("div")
        div.innerHTML = _txt.replaceAll("/", "")
        const listChild = [...div.children]
        listChild.forEach((o) => {
          if (o.hasAttribute("tagname")) {
            o.innerHTML =
              `<span class="highlight--text">${o.getAttribute(
                "tagname",
              )}</span>` + o.innerHTML
          }
        })

        return div.innerHTML
      }
      return _txt
    },
    parseCommentTextIp(_txt) {
      if (!_txt || !String(_txt).trim()) {
        return ""
      }
      const sTxt = String(_txt)
      if (sTxt.includes(`<mention `)) {
        const div = document.createElement("div")
        div.innerHTML = _txt.replaceAll("/", "")
        const listChild = [...div.children]
        listChild.forEach((o) => {
          if (o.hasAttribute("tagname")) {
            o.innerHTML =
              `<span class="highlight--text">${o.getAttribute(
                "tagname",
              )}</span>` + o.innerHTML
          }
        })

        return div.innerText
      }
      return _txt
    },
  },
}
