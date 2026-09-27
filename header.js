/* =============================================================================
   共通ヘッダー header.js
   使い方：
     1. <head> 内に <link rel="stylesheet" href="[rootへの相対パス]/header.css"> を追加
     2. <body> 先頭に <div id="site-header"></div> を置く
     3. <script src="[rootへの相対パス]/header.js"></script> を body 末尾に追加
     4. スクリプトタグに data-current 属性でナビのカレント指定（任意）
        例: <script src="../../header.js" data-current="about"></script>
        値: "index"（ツール一覧）/ "about"（このサイトについて）

   最小化：
     - タイトルをクリックで最小化 / 再クリックで元に戻る
     - 状態は localStorage に保存され、次回アクセス時も維持される
============================================================================= */

(function () {

  /* ── 1. このスクリプトタグを取得してパスとカレントページを解決 ── */
  var scripts   = document.querySelectorAll('script[src*="header.js"]');
  var thisScript = scripts[scripts.length - 1];
  var currentPage = thisScript ? (thisScript.dataset.current || "") : "";

  /* スクリプトの src から root へのパスを導出
     例: src="../../header.js" → rootPath = "../../"  */
  var srcAttr = thisScript ? thisScript.getAttribute("src") : "header.js";
  var rootPath = srcAttr.replace(/header\.js$/, "");

  /* ── 2. ヘッダー HTML を組み立てて挿入 ── */
  var navItems = [
    { key: "index", href: rootPath + "index.html",  label: "ツール一覧" },
    { key: "about", href: rootPath + "about.html",  label: "このサイトについて" },
    { key: "comment", href: "https://forms.gle/y3DZGCg9V2dTLKU47", label: "コメント", blank: true }
  ];

  var navHtml = navItems.map(function (item) {
    var cls    = item.key === currentPage ? ' class="current"' : '';
    var target = item.blank ? ' target="_blank" rel="noopener"' : '';
    return '<a href="' + item.href + '"' + cls + target + '>' + item.label + '</a>';
  }).join("\n      ");

  var headerHtml =
    '<header id="global-header">' +
    '\n  <div class="header-inner">' +
    '\n    <h1 class="site-title">' +
    '\n      <a href="' + rootPath + 'index.html" id="header-title-link" title="クリックでヘッダーを最小化">' +
    '歴史創作お役立ちツール集' +
    '</a>' +
    '\n    </h1>' +
    '\n    <span class="header-deco">REKISHI SOSAKU TOOLS</span>' +
    '\n    <span class="header-toggle-hint">▲ タップで最小化</span>' +
    '\n  </div>' +
    '\n  <nav class="header-nav">' +
    '\n      ' + navHtml +
    '\n  </nav>' +
    '\n</header>';

  /* 挿入先 */
  var placeholder = document.getElementById("site-header");
  if (placeholder) {
    placeholder.outerHTML = headerHtml;
  } else {
    /* #site-header がなければ body 先頭に挿入 */
    document.body.insertAdjacentHTML("afterbegin", headerHtml);
  }

  /* ── 3. 最小化トグル ── */
  var STORAGE_KEY = "header_minimized";

  function getHeader() {
    return document.getElementById("global-header");
  }

  /* 保存された状態を復元 */
  function restoreState() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        var h = getHeader();
        if (h) h.classList.add("minimized");
      }
    } catch (e) { /* localStorage 未対応環境は無視 */ }
  }

  /* トグル */
  function toggleMinimize(e) {
    e.preventDefault(); /* ページ遷移させない */
    var h = getHeader();
    if (!h) return;

    if (h.classList.contains("minimized")) {
      h.classList.remove("minimized");
      try { localStorage.setItem(STORAGE_KEY, "0"); } catch (e) {}
    } else {
      h.classList.add("minimized");
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
    }
  }

  /* DOM 挿入直後にイベント登録 & 状態復元 */
  restoreState();

  var titleLink = document.getElementById("header-title-link");
  if (titleLink) {
    titleLink.addEventListener("click", toggleMinimize);
  }

})();
