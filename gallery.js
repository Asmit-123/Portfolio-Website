/* Gallery. Data below comes from the original photo files (GPS stripped). */
(function () {
  "use strict";
  var DATA = [{"id":"alpine-chough","name":"Alpine Chough","cat":"Birds","frames":[{"full":"alpine-chough-1.webp","w":1600,"h":1600,"tel":{"cam":"NIKON D3200","iso":"ISO 400"}},{"full":"alpine-chough-2.webp","w":1600,"h":1600,"tel":{"cam":"NIKON D3200","iso":"ISO 400"}},{"full":"alpine-chough-3.webp","w":1600,"h":1600,"tel":{"cam":"NIKON D3200","iso":"ISO 400"}}]},{"id":"black-rumped-flameback","name":"Black-rumped Flameback","cat":"Birds","frames":[{"full":"black-rumped-flameback-1.webp","w":1600,"h":1200,"tel":{"cam":"FinePix S6800","f":"f/5.9","t":"1/45s","iso":"ISO 1600","mm":"129mm"}}]},{"id":"blue-collared-kingfisher","name":"Blue-collared Kingfisher","cat":"Birds","frames":[{"full":"blue-collared-kingfisher-1.webp","w":1600,"h":1064,"tel":{"cam":"NIKON D3200","f":"f/5.6","t":"1/500s","iso":"ISO 2000","mm":"300mm"}}]},{"id":"blue-throated-barbet","name":"Blue-throated Barbet","cat":"Birds","frames":[{"full":"blue-throated-barbet-1.webp","w":1600,"h":1067,"tel":{"cam":"NIKON D3200","f":"f/8","t":"1/250s","iso":"ISO 100","mm":"300mm"}}]},{"id":"bronze-winged-jacana","name":"Bronze-Winged Jacana","cat":"Birds","frames":[{"full":"bronze-winged-jacana-1.webp","w":1600,"h":1064,"tel":{"cam":"NIKON D3200","f":"f/5.6","t":"1/500s","iso":"ISO 900","mm":"300mm"}},{"full":"bronze-winged-jacana-2.webp","w":1600,"h":1064,"tel":{"cam":"NIKON D3200","f":"f/5.6","t":"1/500s","iso":"ISO 2800","mm":"300mm"}}]},{"id":"common-kingfisher","name":"Common Kingfisher","cat":"Birds","frames":[{"full":"common-kingfisher-1.webp","w":1600,"h":1053,"tel":{"cam":"NIKON D3200","f":"f/8","t":"1/250s","iso":"ISO 280","mm":"300mm"}}]},{"id":"common-tailorbird","name":"Common Tailorbird","cat":"Birds","frames":[{"full":"common-tailorbird-1.webp","w":1064,"h":1600,"tel":{"cam":"NIKON D3200","f":"f/5.6","t":"1/500s","iso":"ISO 3200","mm":"300mm"}}]},{"id":"white-throated-kingfisher","name":"White-throated Kingfisher","cat":"Birds","frames":[{"full":"white-throated-kingfisher-1.webp","w":1600,"h":1200,"tel":{"cam":"FinePix S6800","f":"f/5.9","t":"1/100s","iso":"ISO 400","mm":"129mm"}}]},{"id":"large-yeoman","name":"Large Yeoman","cat":"Butterflies","frames":[{"full":"large-yeoman-1.webp","w":1600,"h":1064,"tel":{"cam":"NIKON D3200","f":"f/5.6","t":"1/800s","iso":"ISO 400","mm":"300mm"}}]},{"id":"orb-weaver-spider","name":"Orb-Weaver Spider","cat":"Arachnids","frames":[{"full":"orb-weaver-spider-1.webp","w":1064,"h":1600,"tel":{"cam":"NIKON D3200","f":"f/4.8","t":"1/500s","iso":"ISO 1250","mm":"195mm"}}]},{"id":"indian-girgit","name":"Indian Girgit","cat":"Reptiles","frames":[{"full":"indian-girgit-1.webp","w":1080,"h":718,"tel":{}}]},{"id":"tabby-cats","name":"Tabby Cats","cat":"Mammals","frames":[{"full":"tabby-cats-1.webp","w":1080,"h":1080,"tel":{}}]}];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var grid = $("#bsGrid"), filters = $("#bsFilters"), countEl = $("#bsCount"), active = "All";
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var cats = ["All"]; DATA.forEach(function (s) { if (cats.indexOf(s.cat) < 0) cats.push(s.cat); });
  function telText(t) { return [t.cam, t.f, t.t, t.iso, t.mm].filter(Boolean).join(" · "); }
  DATA.forEach(function (s, i) {
    var b = document.createElement("button"); b.type = "button"; b.className = "spec hud"; b.dataset.cat = s.cat;
    b.setAttribute("aria-label", "Open " + s.name + ", " + s.frames.length + (s.frames.length > 1 ? " photos" : " photo"));
    var ph = document.createElement("div"); ph.className = "ph";
    var im = document.createElement("img"); im.src = "./assets/gallery/thumb/" + s.frames[0].full; im.alt = s.name; im.loading = "lazy"; im.width = 640; im.height = 480;
    var no = document.createElement("span"); no.className = "no"; no.textContent = "FRAME " + pad(i + 1);
    ph.appendChild(im); ph.appendChild(no);
    if (s.frames.length > 1) { var fr = document.createElement("span"); fr.className = "fr"; fr.textContent = s.frames.length + " frames"; ph.appendChild(fr); }
    var inf = document.createElement("div"); inf.className = "inf";
    var h = document.createElement("h3"); h.textContent = s.name; var ct = document.createElement("span"); ct.className = "ct"; ct.textContent = s.cat;
    inf.appendChild(h); inf.appendChild(ct); b.appendChild(ph); b.appendChild(inf);
    b.addEventListener("click", function () {
      window.Lightbox.open(s.frames.map(function (f, k) {
        var cap = s.name + " · " + s.cat + (s.frames.length > 1 ? " · frame " + (k + 1) + "/" + s.frames.length : "");
        var t = telText(f.tel); return { src: "./assets/gallery/full/" + f.full, alt: s.name, cap: t ? cap + "\n" + t : cap };
      }), 0);
    });
    grid.appendChild(b);
  });
  function apply() {
    var sp = 0, fr = 0;
    Array.prototype.forEach.call(grid.children, function (c, i) {
      var on = active === "All" || c.dataset.cat === active; c.hidden = !on;
      if (on) { sp++; fr += DATA[i].frames.length; }
    });
    countEl.textContent = sp + (sp === 1 ? " entry · " : " entries · ") + fr + (fr === 1 ? " frame" : " frames");
    Array.prototype.forEach.call(filters.children, function (b) { b.setAttribute("aria-pressed", b.dataset.cat === active); });
  }
  cats.forEach(function (c) {
    var n = c === "All" ? DATA.length : DATA.filter(function (s) { return s.cat === c; }).length;
    var b = document.createElement("button"); b.type = "button"; b.dataset.cat = c; b.textContent = c + " " + n;
    b.addEventListener("click", function () { active = c; apply(); }); filters.appendChild(b);
  });
  apply();
})();
