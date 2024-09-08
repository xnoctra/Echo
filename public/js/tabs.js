let tabIndex = 0;

function createTab(encodedUrl) {
  const tabsContainer = document.body.querySelector(".t-subcontainer");

  tabIndex++;
  const newTabId = "tab-" + tabIndex;
  const newContentId = "content-" + tabIndex;

  let newTab = document.createElement("div");
  newTab.classList.add("tab");
  newTab.id = newTabId;
  let newTitle = document.createElement("p");
  newTitle.textContent = "New Tab";

  let closeButton = document.createElement("div");
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
  <path d="M18 6 6 18"/>
  <path d="m6 6 12 12"/>
  </svg>`;
  closeButton.style.display = "flex";
  closeButton.addEventListener("click", function (event) {
    let tabContent = document.getElementById(newContentId);
    newTab.remove();
    tabContent.remove();
    event.stopPropagation();
    const prevTab = document.getElementById("tab-" + (tabIndex - 1));
    if (prevTab) prevTab.click();
  });
  newTab.appendChild(newTitle);
  newTab.appendChild(closeButton);
  tabsContainer.appendChild(newTab);

  let newContent = document.body.querySelector(".p-container");
  let newIframe = document.createElement("iframe");
  if (!encodedUrl) {
    navigate(newIframe, "echo://newtab");
  } else {
    navigate(newIframe, encodedUrl);
  }
  newIframe.setAttribute("id", newContentId);
  newIframe.classList.add("page");
  newContent.appendChild(newIframe);

  let observer = new MutationObserver(function () {
    if (newIframe.contentDocument) {
      const title = newIframe.contentDocument.title || "Untitled";
      if (
        newTab.querySelector("p") &&
        newTab.querySelector("p").textContent !== title
      ) {
        newTab.querySelector("p").textContent = title;
      }
      setFavicon(newTab, newIframe);
    }
  });

  newIframe.onload = function () {
    setTimeout(() => {
      if (newIframe.contentDocument) {
        let iframeDoc = newIframe.contentDocument;
        newTab.querySelector("p").textContent =
          iframeDoc.title || "New Tab " + tabIndex;
        observer.observe(newIframe.contentDocument.head, {
          childList: true,
          subtree: true,
        });
        setFavicon(newTab, newIframe);
      }
    }, 10);
  };

  newTab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((el) => {
      el.classList.remove("t-active");
    });

    document.querySelectorAll(".page").forEach((el) => {
      el.classList.remove("p-active");
    });
    newTab.classList.add("t-active");
    newIframe.classList.add("p-active");
  });

  newTab.click();
}

function setFavicon(tabElement, iframeElement) {
  try {
    let favicon =
      iframeElement.contentDocument.head.querySelector("link[rel='icon']") ||
      iframeElement.contentDocument.head.querySelector(
        "link[rel='shortcut icon']"
      );

    if (favicon) {
      let faviconImage = document.createElement("img");
      faviconImage.src = favicon.href;
      faviconImage.onload = () =>
        console.log("Favicon has been loaded successfully!");
      faviconImage.onerror = () =>
        console.error("Favicon failed to load:", favicon.href);
      faviconImage.setAttribute("width", "16");
      faviconImage.setAttribute("height", "16");
      faviconImage.style.marginRight = "8px";

      let existingFavicon = tabElement.querySelector("img");
      if (existingFavicon) {
        tabElement.removeChild(existingFavicon);
      }

      tabElement.insertBefore(faviconImage, tabElement.firstChild);
    } else {
      console.warn("No favicon link element found within the iframe document.");
    }
  } catch (e) {
    console.error("Error accessing the iframe document:", e);
  }
}

function processUrl(url) {
  if (url.startsWith("echo://")) {
    const path = url.replace("echo://", "");
    return `/tabs/${path}.html`;
  } else if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  ) {
    return url;
  } else {
    return `/tabs/${url}.html`;
  }
}

function navigate(iframe, url) {
  const processedUrl = processUrl(url);
  if (iframe) {
    iframe.src = processedUrl;
  }
}

document.getElementById("new-t").addEventListener("click", function () {
  createTab();
});

class crypts {
  static encode(str) {
    return encodeURIComponent(
      str
        .toString()
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
        )
        .join("")
    );
  }

  static decode(str) {
    if (str.charAt(str.length - 1) === "/") {
      str = str.slice(0, -1);
    }
    return decodeURIComponent(
      str
        .split("")
        .map((char, ind) =>
          ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char
        )
        .join("")
    );
  }
}

function search(input) {
  input = input.trim();
  const searchTemplate =
    localStorage.getItem("engine") || "https://google.com/search?q=%s";

  try {
    return new URL(input).toString();
  } catch (err) {
    try {
      const url = new URL(`http://${input}`);
      if (url.hostname.includes(".")) {
        return url.toString();
      }
      throw new Error("Invalid hostname");
    } catch (err) {
      return searchTemplate.replace("%s", encodeURIComponent(input));
    }
  }
}
if ("serviceWorker" in navigator) {
  var proxySetting = "uv";
  let swConfig = {
    uv: { file: "/@/sw.js", config: __uv$config },
  };

  let { file: swFile, config: swConfigSettings } = swConfig[proxySetting];

  navigator.serviceWorker
    .register(swFile, { scope: swConfigSettings.prefix })
    .then((registration) => {
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
      document.getElementById("utilSearch").addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          event.preventDefault();

        let encodedUrl =
          swConfigSettings.prefix + crypts.encode(search(document.getElementById("utilSearch").value));
        document.querySelector("iframe.page.p-active").src = encodedUrl;
        }
      });
    })
    .catch((error) => {
      console.error("ServiceWorker registration failed:", error);
    });
}
