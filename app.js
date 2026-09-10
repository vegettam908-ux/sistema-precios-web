const CONFIG = window.SISTEMA_CONFIG || { demoMode:true, supabaseUrl:"", supabaseAnonKey:"" };

const state = {
  products: [],
  users: [],
  currentUser: null,
  selectedCategory: "",
  search: "",
  priceView: "all",
  selectedBrand: "",
  catalogPage: 1,
  pageSize: 12
};

const demoUsers = [
  { id: 1, usuario: "admin", nombre: "Administrador", rol: "Administrador", password: "admin", activo: true, fecha_registro: "2026-01-01" },
  { id: 2, usuario: "trabajador", nombre: "Trabajador", rol: "Trabajador", password: "1234", activo: true, fecha_registro: "2026-01-02" }
];

const demoProducts = [
  {id:1,categoria:"Abarrotes",nombre:"Arroz",precio_unidad:4.50,precios_mayor:[{Presentacion:"SIX",Precio:25},{Presentacion:"Docena",Precio:48},{Presentacion:"Paquete",Precio:110}],precio_mercado:5,precio_publico:5.50,imagen_url:""},
  {id:2,categoria:"Abarrotes",nombre:"Azúcar",precio_unidad:4.20,precios_mayor:[{Presentacion:"SIX",Precio:24},{Presentacion:"Docena",Precio:46},{Presentacion:"Paquete",Precio:105}],precio_mercado:4.80,precio_publico:5.20,imagen_url:""}
];

const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  updateConnectionNotice();
  const saved = localStorage.getItem("sp_session");
  if (saved) {
    try { state.currentUser = JSON.parse(saved); showApp(); }
    catch { localStorage.removeItem("sp_session"); showLogin(); }
  } else showLogin();
});

function bindEvents() {
  $("loginForm").addEventListener("submit", login);
  $("registerForm").addEventListener("submit", register);
  $("registerToggle").onclick = () => toggleAuth(true);
  $("loginToggle").onclick = () => toggleAuth(false);
  $("logoutBtn").onclick = logout;
  $("refreshBtn").onclick = loadData;
  $("searchInput").oninput = e => { state.search = e.target.value.toLowerCase(); state.catalogPage=1; renderCatalog(); };
  $("categorySelect").onchange = e => { state.selectedCategory = e.target.value; state.selectedBrand = ""; buildCategories(); renderCatalog(); };
  $("priceView").onchange = e => { state.priceView = e.target.value; state.catalogPage=1; renderCatalog(); };
  $("newProductBtn").onclick = () => openProductModal();
  $("selectAllProductsBtn").onclick = () => setAllProductChecks(true);
  $("deselectProductsBtn").onclick = () => setAllProductChecks(false);
  $("selectAllProducts").onchange = e => setAllProductChecks(e.target.checked);
  $("editSelectedBtn").onclick = editSelectedProduct;
  $("deleteSelectedBtn").onclick = deleteSelectedProducts;
  $("newProductBtn2").onclick = () => openProductModal();
  $("generateImportBtn").onclick = generateImportPreview;
  $("addPresentationBtn").onclick = () => addPresentationRow();
  $("productForm").addEventListener("submit", saveProduct);
  bindImageEditor();
  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeProductModal));
  document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => switchSection(btn.dataset.section)));
  $("mobileMenu").onclick = openMobile;
  $("mobileClose").onclick = closeMobile;
  $("mobileOverlay").onclick = closeMobile;
}

function updateConnectionNotice() {
  const el = $("connectionNotice");
  el.textContent = CONFIG.demoMode
    ? "Modo demostración activo."
    : "Conectado al mismo Supabase del sistema MAUI.";
}

function showLogin() {
  $("loginView").classList.remove("hidden");
  $("appView").classList.add("hidden");
}
function showApp() {
  $("loginView").classList.add("hidden");
  $("appView").classList.remove("hidden");
  $("userName").textContent = state.currentUser.nombre || state.currentUser.usuario;
  $("userRole").textContent = state.currentUser.rol || "Trabajador";
  $("userInitial").textContent = (state.currentUser.nombre || state.currentUser.usuario || "U").charAt(0).toUpperCase();
  document.querySelectorAll(".admin-only").forEach(el => { el.style.display = isAdmin() ? "flex" : "none"; });
  $("appView").classList.toggle("admin-mode", isAdmin());
  switchSection("catalogo");
  loadData();
}
function isAdmin() { return ["admin","administrador"].includes(String(state.currentUser?.rol || "").trim().toLowerCase()); }

async function login(e) {
  e.preventDefault();
  const usuario = $("usuario").value.trim().toLowerCase();
  const password = $("password").value.trim();
  if (!usuario || !password) return toast("Completa usuario y contraseña.");

  try {
    const users = CONFIG.demoMode ? demoUsers : await supabaseGet("usuarios", "select=*&usuario=eq." + encodeURIComponent(usuario) + "&limit=1");
    const account = users[0];
    if (!account || account.activo === false || account.password !== password) return toast("Usuario o contraseña incorrectos.");
    state.currentUser = account;
    localStorage.setItem("sp_session", JSON.stringify(account));
    $("password").value = "";
    showApp();
  } catch (err) {
    console.error(err);
    toast("No se pudo conectar con Supabase. Revisa la configuración y las políticas RLS.");
  }
}

async function register(e) {
  e.preventDefault();
  const usuario = $("regUsuario").value.trim().toLowerCase();
  const nombre = $("regNombre").value.trim();
  const password = $("regPassword").value.trim();
  if (!usuario || !nombre || !password) return toast("Completa todos los campos.");
  if (password.length < 3) return toast("La contraseña debe tener al menos 3 caracteres.");
  try {
    const users = CONFIG.demoMode ? demoUsers : await supabaseGet("usuarios", "select=*&usuario=eq." + encodeURIComponent(usuario) + "&limit=1");
    if (users.length) return toast("Este usuario ya existe.");
    if (CONFIG.demoMode) demoUsers.push({id:Date.now(),usuario,nombre,rol:"Trabajador",password,activo:true,fecha_registro:new Date().toISOString()});
    else await supabaseInsert("usuarios", {usuario,nombre,rol:"Trabajador",password,activo:true,fecha_registro:new Date().toISOString()});
    toggleAuth(false);
    $("usuario").value = usuario;
    toast("Usuario registrado. Ahora inicia sesión.");
  } catch (err) { console.error(err); toast("No se pudo registrar el usuario."); }
}

function toggleAuth(registerMode) {
  $("loginForm").classList.toggle("hidden", registerMode);
  $("registerForm").classList.toggle("hidden", !registerMode);
}
function logout() {
  localStorage.removeItem("sp_session");
  state.currentUser = null;
  showLogin();
}

async function loadData() {
  $("loading").classList.remove("hidden");
  $("productGrid").innerHTML = "";
  try {
    state.products = CONFIG.demoMode ? [...demoProducts] : await supabaseGet("productos", "select=*");
    state.products = state.products.map(normalizeProduct);
    if (isAdmin()) state.users = CONFIG.demoMode ? [...demoUsers] : await supabaseGet("usuarios", "select=*");
    buildCategories();
    buildPriceFilter();
    renderCatalog();
    if (isAdmin()) { renderUsers(); renderProductTable(); }
  } catch (err) {
    console.error(err);
    toast("No se pudieron cargar los datos de Supabase.");
  } finally { $("loading").classList.add("hidden"); }
}

function normalizeProduct(p) {
  return {
    ...p,
    precios_mayor: normalizePresentations(p.precios_mayor),
    precio_unidad: numberOrNull(p.precio_unidad),
    precio_mercado: numberOrNull(p.precio_mercado),
    precio_publico: numberOrNull(p.precio_publico),
    imagen_url: p.imagen_url || ""
  };
}

// MAUI guarda precios_mayor como una lista de objetos: [{Presentacion, Precio}].
// También soportamos datos antiguos que vengan como objeto {six:..., docena:...}.
function normalizePresentations(value) {
  if (!value) return [];
  let data = value;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { return []; }
  }
  if (Array.isArray(data)) {
    return data.map(x => ({
      Presentacion: String(x?.Presentacion ?? x?.presentacion ?? x?.nombre ?? "").trim(),
      Precio: numberOrNull(x?.Precio ?? x?.precio)
    })).filter(x => x.Presentacion && x.Precio !== null);
  }
  if (typeof data === "object") {
    return Object.entries(data).map(([key,val]) => ({
      Presentacion: presentationLabelFromKey(key),
      Precio: numberOrNull(val)
    })).filter(x => x.Presentacion && x.Precio !== null);
  }
  return [];
}

function presentationLabelFromKey(key) {
  const k = String(key || "").trim();
  const map = { six:"SIX", SIX:"SIX", docena:"Docena", media_docena:"Media docena", tira:"Tira", paquete:"Paquete", bolsa:"Bolsa", caja:"Caja", saco:"Saco", plancha:"Plancha", display:"Display", pack:"Pack", bulto:"Bulto" };
  return map[k] || map[k.toLowerCase()] || k;
}

function buildCategories() {
  const cats = [...new Set(state.products.map(p => (p.categoria || "").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  $("categoryList").innerHTML = `<button class="category-btn ${state.selectedCategory===""?"active":""}" data-cat="">▦ &nbsp; Todas</button>` +
    cats.map(c => `<button class="category-btn ${state.selectedCategory===c?"active":""}" data-cat="${escapeAttr(c)}">◈ &nbsp; ${escapeHtml(c)}</button>`).join("");
  $("categorySelect").innerHTML = `<option value="">Todas las categorías</option>` + cats.map(c=>`<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  $("categorySelect").value = state.selectedCategory;
  $("breadcrumbCategory").textContent = state.selectedCategory || "Todas";
  document.querySelectorAll(".category-btn").forEach(b => b.onclick = () => {
    state.selectedCategory = b.dataset.cat;
    state.selectedBrand = "";
    state.catalogPage = 1;
    $("categorySelect").value = state.selectedCategory;
    buildCategories();
    renderCatalog();
  });
}

function buildPriceFilter() {
  const labels = new Map();
  state.products.flatMap(p => p.precios_mayor || []).forEach(x => {
    const label = x.Presentacion;
    const key = `mayor:${label}`;
    if (!labels.has(key)) labels.set(key, label);
  });
  const current = state.priceView;
  $("priceView").innerHTML = `<option value="all">Todos los precios</option>
    <option value="unidad">Precio unidad</option>
    <option value="mayor">Todas las presentaciones por mayor</option>
    ${[...labels.entries()].map(([key,label])=>`<option value="${escapeAttr(key)}">${escapeHtml(label)}</option>`).join("")}
    <option value="mercado">Precio mercado</option>
    <option value="publico">Precio público</option>`;
  if (["all","unidad","mayor","mercado","publico"].includes(current) || labels.has(current)) $("priceView").value = current;
  else $("priceView").value = "all";
}

function getBrandsForCategory() {
  const base = state.products.filter(p => !state.selectedCategory || (p.categoria||"") === state.selectedCategory);
  const common = ["Marsella","Opal","Bolívar","Ace","Ariel","Doff","Patito","Cafetal","Eco","Altomayo","Kirma","Nescafé","Milo","Nesquik","Sello de Oro","Manty","Molitalia","Don Vittorio","Cielo","Anita","Caballero","Faraón","Caserita","Taipa","Rinus","Pacasmayo","Casa Grande","Dulce Norte"];
  const found = common.filter(b => base.some(p => String(p.nombre||"").toLowerCase().includes(b.toLowerCase())));
  return ["Todas", ...found];
}
function renderBrandStrip() {
  const brands = getBrandsForCategory();
  $("brandStrip").innerHTML = brands.map(b => `<button type="button" class="brand-pill ${state.selectedBrand===b || (!state.selectedBrand && b==="Todas") ? "active" : ""}" data-brand="${escapeAttr(b)}">${escapeHtml(b)}</button>`).join("");
  document.querySelectorAll(".brand-pill").forEach(btn => btn.onclick = () => {
    state.selectedBrand = btn.dataset.brand === "Todas" ? "" : btn.dataset.brand;
    state.catalogPage = 1;
    renderBrandStrip();
    renderCatalog();
  });
}
function filteredProducts() {
  return state.products.filter(p => {
    const text = `${p.nombre||""} ${p.categoria||""}`.toLowerCase();
    const matchesText = !state.search || text.includes(state.search);
    const matchesCat = !state.selectedCategory || (p.categoria||"") === state.selectedCategory;
    const matchesBrand = !state.selectedBrand || String(p.nombre||"").toLowerCase().includes(state.selectedBrand.toLowerCase());
    return matchesText && matchesCat && matchesBrand;
  });
}

function renderCatalog() {
  renderBrandStrip();
  const list = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.catalogPage > totalPages) state.catalogPage = totalPages;
  const start = (state.catalogPage - 1) * state.pageSize;
  const visible = list.slice(start, start + state.pageSize);
  $("stats").innerHTML = `
    <div class="stat"><div class="stat-label">Productos</div><div class="stat-value">${state.products.length}</div></div>
    <div class="stat"><div class="stat-label">Categorías</div><div class="stat-value">${new Set(state.products.map(p=>p.categoria).filter(Boolean)).size}</div></div>
    <div class="stat"><div class="stat-label">Mostrando</div><div class="stat-value">${list.length}</div></div>`;
  $("productGrid").innerHTML = visible.map(productCard).join("");
  renderCatalogPagination(list.length, totalPages);
  $("emptyState").classList.toggle("hidden", list.length !== 0);
}
function renderCatalogPagination(total, totalPages) {
  const el = $("catalogPagination");
  if (!total) { el.innerHTML=""; return; }
  let html = `<button type="button" class="page-btn" data-page="${Math.max(1,state.catalogPage-1)}" ${state.catalogPage===1?"disabled":""}>‹</button>`;
  for(let i=1;i<=totalPages;i++) {
    if(totalPages>7 && i>2 && i<totalPages-1 && Math.abs(i-state.catalogPage)>1) { if(i===3 || i===totalPages-2) html += `<span class="page-dots">…</span>`; continue; }
    html += `<button type="button" class="page-btn ${i===state.catalogPage?"active":""}" data-page="${i}">${i}</button>`;
  }
  html += `<button type="button" class="page-btn" data-page="${Math.min(totalPages,state.catalogPage+1)}" ${state.catalogPage===totalPages?"disabled":""}>›</button><span class="page-summary">Mostrando ${Math.min(total,startIndex(total))}-${Math.min(total,startIndex(total)+state.pageSize-1)} de ${total} productos</span>`;
  el.innerHTML=html;
  el.querySelectorAll(".page-btn:not([disabled])").forEach(b=>b.onclick=()=>{state.catalogPage=Number(b.dataset.page);renderCatalog();window.scrollTo({top:0,behavior:"smooth"});});
}
function startIndex(total){ return total ? ((state.catalogPage-1)*state.pageSize)+1 : 0; }

function productCard(p) {
  const prices = priceRows(p);
  const img = p.imagen_url ? `<img src="${escapeAttr(p.imagen_url)}" alt="${escapeAttr(p.nombre||"Producto")}" onerror="this.style.display='none';this.parentElement.querySelector('.no-image').style.display='block'">` : "";
  return `<article class="product-card">
    <div class="product-image">${img}<div class="no-image" style="${p.imagen_url?'display:none':''}">▧</div></div>
    <div class="product-body">
      <div class="product-category">${escapeHtml(p.categoria || "Sin categoría")}</div>
      <div class="product-name">${escapeHtml(p.nombre || "Producto sin nombre")}</div>
      <div class="price-list">${prices}</div>
    </div>
  </article>`;
}

function priceRows(p) {
  const rows = [];
  if (p.precio_unidad !== null) rows.push({key:"unidad",label:"Unidad",price:p.precio_unidad});
  for (const item of p.precios_mayor || []) rows.push({key:`mayor:${item.Presentacion}`,label:item.Presentacion,price:item.Precio});
  if (p.precio_mercado !== null) rows.push({key:"mercado",label:"Mercado",price:p.precio_mercado});
  if (p.precio_publico !== null) rows.push({key:"publico",label:"Público",price:p.precio_publico});

  const filtered = rows.filter(r => {
    if (state.priceView === "all") return true;
    if (state.priceView === "mayor") return r.key.startsWith("mayor:");
    return r.key === state.priceView;
  });
  return filtered.map(r => `<div class="price-row${state.priceView===r.key?" highlight":""}"><span>${escapeHtml(r.label)}</span><strong>S/ ${money(r.price)}</strong></div>`).join("") || `<div class="price-row"><span>Precio</span><strong>Consultar</strong></div>`;
}

function renderProductTable() {
  if (!isAdmin()) return;
  $("productTableBody").innerHTML = state.products.map(p => `<tr>
    <td><input class="product-check" type="checkbox" value="${Number(p.id)}"></td>
    <td>${p.imagen_url ? `<img class="table-product-img" src="${escapeAttr(p.imagen_url)}" alt="" onerror="this.style.display='none'">` : `<span class="table-product-placeholder">▧</span>`}</td>
    <td><strong>${escapeHtml(p.nombre||"")}</strong></td>
    <td>${escapeHtml(p.categoria||"")}</td>
    <td>${moneyCell(p.precio_unidad)}</td>
    <td>${p.precios_mayor?.length ? `<div class="presentation-list">${p.precios_mayor.map(x=>`<span class="presentation-chip">${escapeHtml(x.Presentacion)}: S/ ${money(x.Precio)}</span>`).join("")}</div>` : "—"}</td>
    <td>${moneyCell(p.precio_mercado)}</td>
    <td>${moneyCell(p.precio_publico)}</td>
    <td><div class="actions"><button class="small-btn" onclick="openProductModal(${Number(p.id)})">Editar</button><button class="small-btn danger" onclick="deleteProduct(${Number(p.id)})">Eliminar</button></div></td>
  </tr>`).join("");
  document.querySelectorAll(".product-check").forEach(c => c.onchange = updateSelectedCount);
  $("selectAllProducts").checked = false;
  updateSelectedCount();
}
function getSelectedProductIds(){ return [...document.querySelectorAll(".product-check:checked")].map(x=>Number(x.value)); }
function updateSelectedCount(){ const ids=getSelectedProductIds(); $("selectedCount").textContent=`${ids.length} seleccionado${ids.length===1?"":"s"}`; $("editSelectedBtn").textContent=`✎ EDITAR (${ids.length})`; $("deleteSelectedBtn").textContent=`▣ ELIMINAR (${ids.length})`; const all=document.querySelectorAll(".product-check"); $("selectAllProducts").checked=all.length>0&&ids.length===all.length; }
function setAllProductChecks(checked){ document.querySelectorAll(".product-check").forEach(c=>c.checked=checked); $("selectAllProducts").checked=checked; updateSelectedCount(); }
function editSelectedProduct(){ const ids=getSelectedProductIds(); if(ids.length!==1) return toast("Selecciona exactamente un producto para editarlo."); openProductModal(ids[0]); }
async function deleteSelectedProducts(){
  const ids=getSelectedProductIds();
  if(!ids.length) return toast("Selecciona al menos un producto.");
  if(!confirm(`¿Deseas eliminar ${ids.length} producto${ids.length===1?"":"s"}?`)) return;
  try{
    for(const id of ids){
      if(CONFIG.demoMode){ const idx=demoProducts.findIndex(x=>Number(x.id)===Number(id)); if(idx>=0) demoProducts.splice(idx,1); }
      else await supabaseDelete("productos","id=eq."+encodeURIComponent(id));
    }
    toast(`${ids.length} producto${ids.length===1?"":"s"} eliminado${ids.length===1?"":"s"}.`); await loadData();
  }catch(err){console.error(err);toast("No se pudieron eliminar los productos seleccionados.");}
}
function generateImportPreview(){
  const text=$("importText").value.trim();
  if(!text) return toast("Pega primero la lista de productos.");
  const items=parseImportText(text);
  if(!items.length) return toast("No pude detectar productos. Revisa el formato.");
  const preview=$("importPreview");
  preview.classList.remove("hidden");
  preview.innerHTML=`<div class="preview-title"><div><strong>${items.length} producto${items.length===1?"":"s"} detectado${items.length===1?"":"s"}</strong><small>Revisa y edita nombre, categoría, presentación, cantidad, precios e imagen antes de guardar.</small></div><button class="small-btn" type="button" id="saveImportedBtn">Guardar productos</button></div>`+
    `<div class="import-preview-list">${items.map((p,i)=>renderImportItem(p,i)).join("")}</div>`;
  bindImportPreview(items);
}
function renderImportItem(p,i){
  const pres=p.precios_mayor||[];
  return `<div class="import-item import-item-pro" data-index="${i}">
    <div class="import-check"><input class="imp-check" type="checkbox" checked></div>
    <div class="import-image-editor">
      <div class="import-image-box"><img class="imp-image-preview" src="${escapeAttr(p.imagen_url||"")}" ${p.imagen_url?"":"style=\"display:none\""} alt=""><div class="imp-image-empty" ${p.imagen_url?"style=\"display:none\"":""}>🖼️<span>Sin imagen</span></div></div>
      <input class="imp-image-file" type="file" accept="image/png,image/jpeg,image/webp" hidden>
      <button class="imp-image-btn" type="button">🖼️ Cambiar imagen</button>
      <button class="imp-image-remove" type="button">🗑️ Quitar</button>
      <div class="field imp-image-url-field"><label>URL de imagen</label><input class="imp-image-url" type="url" value="${escapeAttr(p.imagen_url && !String(p.imagen_url).startsWith("data:") ? p.imagen_url : "")}" placeholder="https://..."></div>
    </div>
    <div class="import-main-fields">
      <div class="field"><label>Nombre</label><input class="imp-name" value="${escapeAttr(p.nombre)}"></div>
      <div class="field"><label>Categoría</label><input class="imp-cat" value="${escapeAttr(p.categoria)}"></div>
      <div class="field"><label>Presentación principal</label><input class="imp-main-presentation" value="${escapeAttr(p.presentacion_principal||"")}" placeholder="Ej. Paquete de 10 kg"></div>
      <div class="field"><label>Cantidad</label><input class="imp-quantity" type="number" min="0" step="1" value="${p.cantidad??""}" placeholder="Opcional"></div>
      <div class="field"><label>Precio unidad</label><input class="imp-unit" type="number" step="0.01" value="${p.precio_unidad??""}" placeholder="Sin precio"></div>
      <div class="field"><label>Mercado (adentro)</label><input class="imp-market" type="number" step="0.01" value="${p.precio_mercado??""}" placeholder="Sin precio"></div>
      <div class="field"><label>Público (afuera)</label><input class="imp-public" type="number" step="0.01" value="${p.precio_publico??""}" placeholder="Sin precio"></div>
    </div>
    <div class="import-presentations">
      <div class="import-section-title">Precios y presentaciones <button class="imp-add-pres" type="button">＋ Agregar</button></div>
      <div class="imp-pres-list">${pres.map((x,j)=>renderImportPresentation(x,j)).join("")}</div>
      ${!pres.length?'<div class="empty-pres">No hay presentaciones con precio.</div>':''}
    </div>
  </div>`;
}
function renderImportPresentation(x,j){
  return `<div class="imp-pres-row"><input class="imp-pres-name" value="${escapeAttr(x.Presentacion||"")}" placeholder="Presentación"><input class="imp-pres-price" type="number" step="0.01" min="0" value="${x.Precio??""}" placeholder="Precio"><button class="imp-pres-remove" type="button" title="Eliminar">×</button></div>`;
}
function bindImportPreview(items){
  document.querySelectorAll(".import-item-pro").forEach(card=>{
    const i=Number(card.dataset.index);
    card.querySelector(".imp-image-btn").onclick=()=>card.querySelector(".imp-image-file").click();
    card.querySelector(".imp-image-file").onchange=e=>{
      const file=e.target.files?.[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=()=>{items[i].imagen_url=reader.result; card.querySelector(".imp-image-url").value=""; updateImportImage(card,reader.result);};
      reader.readAsDataURL(file);
    };
    card.querySelector(".imp-image-remove").onclick=()=>{items[i].imagen_url=null; card.querySelector(".imp-image-url").value=""; updateImportImage(card,"");};
    card.querySelector(".imp-image-url").oninput=e=>{items[i].imagen_url=e.target.value.trim()||null; updateImportImage(card,items[i].imagen_url||"");};
    card.querySelector(".imp-add-pres").onclick=()=>{
      const list=card.querySelector(".imp-pres-list");
      list.insertAdjacentHTML("beforeend",renderImportPresentation({Presentacion:"",Precio:""},list.children.length));
      card.querySelector(".empty-pres")?.remove();
      bindPresentationRemove(list.lastElementChild);
    };
    card.querySelectorAll(".imp-pres-remove").forEach(bindPresentationRemove);
  });
  $("saveImportedBtn").onclick=()=>saveImportedProducts(items);
}
function bindPresentationRemove(row){ row.onclick=()=>{}; row.querySelector(".imp-pres-remove").onclick=()=>row.remove(); }
function updateImportImage(card,src){
  const img=card.querySelector(".imp-image-preview"), empty=card.querySelector(".imp-image-empty");
  if(src){img.src=src;img.style.display="block";empty.style.display="none";}else{img.removeAttribute("src");img.style.display="none";empty.style.display="flex";}
}
function parseImportText(text){
  return text.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map(line=>{
    const parts=line.split("|").map(x=>x.trim()).filter(Boolean); if(!parts.length)return null;
    const p={nombre:parts[0],categoria:"",presentacion_principal:"",cantidad:null,precio_unidad:null,precios_mayor:[],precio_mercado:null,precio_publico:null,imagen_url:null};
    if(parts[1]&&!/^(cantidad|precio|imagen)/i.test(parts[1]))p.categoria=parts[1];
    if(parts[2]&&!/^(cantidad|precio|imagen)/i.test(parts[2]))p.presentacion_principal=parts[2];
    for(const part of parts.slice(2)){
      const qty=part.match(/^cantidad\s*:\s*(\d+(?:[.,]\d+)?)/i); if(qty){p.cantidad=Number(qty[1].replace(",","."));continue;}
      const im=part.match(/^imagen(?:\s+url)?\s*:\s*(.+)$/i); if(im){p.imagen_url=im[1].trim();continue;}
      const m=part.match(/^([^:]+):\s*(.+)$/); if(!m)continue;
      const label=m[1].trim(), low=label.toLowerCase(), num=parseMoney(m[2]); if(num===null)continue;
      if(/precio\s+(por\s+)?unidad|precio\s+unitario/.test(low))p.precio_unidad=num;
      else if(/precio\s+mercado|^mercado/.test(low))p.precio_mercado=num;
      else if(/precio\s+(público|publico)|^(público|publico)/.test(low))p.precio_publico=num;
      else if(/^precio\s+/.test(low))p.precios_mayor.push({Presentacion:prettyPresentation(label.replace(/^precio\s+/i,"")),Precio:num});
      else if(/six|docena|media docena|tira|bolsa|caja|paquete|saco|plancha|display|pack|bulto/i.test(label))p.precios_mayor.push({Presentacion:prettyPresentation(label),Precio:num});
    }
    p.precios_mayor=dedupePresentations(p.precios_mayor); return p;
  }).filter(Boolean);
}
function parseMoney(v){const n=Number(String(v).replace(/s\/\.?/gi,"").replace(/,/g,".").trim());return Number.isFinite(n)?n:null;}
function prettyPresentation(v){const s=String(v).trim(),k=s.toLowerCase();const map={six:"SIX",docena:"Docena",tira:"Tira",bolsa:"Bolsa",caja:"Caja",paquete:"Paquete",saco:"Saco",plancha:"Plancha",display:"Display",pack:"Pack",bulto:"Bulto","media docena":"Media docena"};return map[k]||s;}
function dedupePresentations(a){const seen=new Set();return a.filter(x=>{const k=x.Presentacion.toLowerCase()+"|"+x.Precio;if(seen.has(k))return false;seen.add(k);return true;});}
async function saveImportedProducts(items){
  try{
    const selected=[];
    document.querySelectorAll(".import-item-pro").forEach(el=>{
      const i=Number(el.dataset.index); if(!el.querySelector(".imp-check")?.checked)return;
      items[i].nombre=el.querySelector(".imp-name").value.trim();
      items[i].categoria=el.querySelector(".imp-cat").value.trim();
      items[i].presentacion_principal=el.querySelector(".imp-main-presentation").value.trim();
      items[i].cantidad=numOrNull(el.querySelector(".imp-quantity").value);
      items[i].precio_unidad=numOrNull(el.querySelector(".imp-unit").value);
      items[i].precio_mercado=numOrNull(el.querySelector(".imp-market").value);
      items[i].precio_publico=numOrNull(el.querySelector(".imp-public").value);
      items[i].precios_mayor=[...el.querySelectorAll(".imp-pres-row")].map(row=>({Presentacion:row.querySelector(".imp-pres-name").value.trim(),Precio:numOrNull(row.querySelector(".imp-pres-price").value)})).filter(x=>x.Presentacion&&x.Precio!==null);
      selected.push(items[i]);
    });
    if(!selected.length)return toast("Selecciona al menos un producto.");
    for(const item of selected){
      const payload={nombre:item.nombre,categoria:item.categoria,precio_unidad:item.precio_unidad,precios_mayor:JSON.stringify(item.precios_mayor),precio_mercado:item.precio_mercado,precio_publico:item.precio_publico,imagen_url:item.imagen_url,fecha_creacion:new Date().toISOString(),fecha_actualizacion:new Date().toISOString()};
      if(CONFIG.demoMode)demoProducts.push({id:Date.now()+Math.random(),...payload});else await supabaseInsert("productos",payload);
    }
    $("importText").value="";$("importPreview").classList.add("hidden");toast(`${selected.length} producto${selected.length===1?"":"s"} guardado${selected.length===1?"":"s"}.`);await loadData();
  }catch(err){console.error(err);toast("No se pudieron guardar los productos importados. Revisa las políticas de Supabase.");}
}

function moneyCell(v){ return v===null||v===undefined||v==="" ? "—" : `S/ ${money(v)}`; }
function money(v){ return Number(v).toFixed(2); }

function openProductModal(id=null) {
  if (!isAdmin()) return toast("Solo un administrador puede modificar productos.");
  const p = id ? state.products.find(x=>Number(x.id)===Number(id)) : null;
  $("modalTitle").textContent = p ? "Editar producto" : "Nuevo producto";
  $("productId").value = p?.id || "";
  $("pNombre").value = p?.nombre || "";
  $("pCategoria").value = p?.categoria || "";
  $("pUnidad").value = p?.precio_unidad ?? "";
  $("pUnidadMirror").value = p?.precio_unidad ?? "";
  $("pMercado").value = p?.precio_mercado ?? "";
  $("pMainPresentation").value = p?.precios_mayor?.[0]?.Presentacion || "";
  $("pQuantity").value = "";
  $("pPublico").value = p?.precio_publico ?? "";
  $("pImagen").value = (p?.imagen_url || "").startsWith("data:") ? "" : (p?.imagen_url || "");
  setProductImagePreview(p?.imagen_url || "");
  $("presentationRows").innerHTML = "";
  (p?.precios_mayor || []).forEach(x => addPresentationRow(x.Presentacion, x.Precio));
  if (!(p?.precios_mayor || []).length) addPresentationRow();
  $("pUnidadMirror").oninput = () => { $("pUnidad").value = $("pUnidadMirror").value; };
  $("pUnidad").oninput = () => { $("pUnidadMirror").value = $("pUnidad").value; };
  $("modalDeleteBtn").onclick = () => { if (p?.id) deleteProduct(p.id); else closeProductModal(); };
  $("modalDeleteBtn").textContent = p?.id ? "▣ Eliminar producto" : "× Cancelar";
  $("productModal").classList.remove("hidden");
}
function closeProductModal(){ $("productModal").classList.add("hidden"); }

let editedProductImage = "";
function bindImageEditor(){
  $("changeImageBtn").onclick = () => $("pImageFile").click();
  $("pImageFile").onchange = handleImageFile;
  $("pImagen").oninput = () => { if ($("pImagen").value.trim()) setProductImagePreview($("pImagen").value.trim()); };
  $("deleteImageBtn").onclick = () => { editedProductImage = ""; $("pImagen").value = ""; setProductImagePreview(""); };
  $("rotateImageBtn").onclick = () => transformProductImage("rotate");
  $("cropImageBtn").onclick = () => transformProductImage("crop");
  $("removeBgBtn").onclick = () => transformProductImage("removebg");
}
function setProductImagePreview(src){
  editedProductImage = src || "";
  const img=$("productImagePreview"), empty=$("productImageEmpty");
  if(src){ img.src=src; img.style.display="block"; empty.style.display="none"; }
  else { img.removeAttribute("src"); img.style.display="none"; empty.style.display="block"; }
}
function handleImageFile(e){
  const file=e.target.files?.[0]; if(!file) return;
  if(file.size>2*1024*1024){ toast("La imagen supera los 2 MB."); e.target.value=""; return; }
  if(!/^image\/(png|jpeg|webp)$/.test(file.type)){ toast("Usa una imagen JPG, PNG o WEBP."); return; }
  const reader=new FileReader();
  reader.onload=()=>{ editedProductImage=reader.result; $("pImagen").value=""; setProductImagePreview(editedProductImage); };
  reader.readAsDataURL(file);
}
function transformProductImage(mode){
  const src=editedProductImage || $("pImagen").value.trim();
  if(!src) return toast("Primero carga o coloca una imagen.");
  const img=new Image();
  img.onload=()=>{
    const canvas=document.createElement("canvas");
    let w=img.naturalWidth, h=img.naturalHeight, angle=0;
    if(mode==="rotate"){ angle=Math.PI/2; canvas.width=h; canvas.height=w; }
    else if(mode==="crop"){ const size=Math.min(w,h); canvas.width=size; canvas.height=size; }
    else { canvas.width=w; canvas.height=h; }
    const ctx=canvas.getContext("2d");
    if(mode==="rotate"){ ctx.translate(h/2,w/2); ctx.rotate(angle); ctx.drawImage(img,-w/2,-h/2); }
    else if(mode==="crop"){ const sx=(w-h)/2>0?(w-h)/2:0, sy=(h-w)/2>0?(h-w)/2:0, size=Math.min(w,h); ctx.drawImage(img,sx,sy,size,size,0,0,size,size); }
    else { ctx.drawImage(img,0,0); const data=ctx.getImageData(0,0,w,h), d=data.data; for(let i=0;i<d.length;i+=4){ if(d[i]>238 && d[i+1]>238 && d[i+2]>238){ d[i+3]=0; } } ctx.putImageData(data,0,0); }
    const out=canvas.toDataURL("image/png"); setProductImagePreview(out); $("pImagen").value="";
  };
  img.onerror=()=>toast("No se pudo editar esta imagen. Si viene de una URL externa, súbela desde tu PC para editarla.");
  img.crossOrigin="anonymous"; img.src=src;
}

function addPresentationRow(label="", price="") {
  const row = document.createElement("div");
  row.className = "presentation-edit-row";
  row.innerHTML = `<input class="presentation-name" placeholder="Ej. Tira (12 unidades)" value="${escapeAttr(label)}"><input class="presentation-price" type="number" step="0.01" min="0" placeholder="Precio" value="${price ?? ""}"><button class="small-btn danger remove-presentation" type="button" title="Quitar presentación">×</button>`;
  row.querySelector(".remove-presentation").onclick = () => row.remove();
  $("presentationRows").appendChild(row);
}

async function saveProduct(e) {
  e.preventDefault();
  const id = $("productId").value;
  const preciosMayor = [...document.querySelectorAll(".presentation-edit-row")].map(row => ({
    Presentacion: row.querySelector(".presentation-name").value.trim(),
    Precio: numOrNull(row.querySelector(".presentation-price").value)
  })).filter(x => x.Presentacion && x.Precio !== null);

  const product = {
    nombre:$("pNombre").value.trim(),
    categoria:$("pCategoria").value.trim(),
    precio_unidad:numOrNull($("pUnidad").value),
    precios_mayor:preciosMayor,
    precio_mercado:numOrNull($("pMercado").value),
    precio_publico:numOrNull($("pPublico").value),
    imagen_url:(editedProductImage || $("pImagen").value.trim() || null),
    fecha_actualizacion:new Date().toISOString()
  };
  try {
    if (CONFIG.demoMode) {
      if (id) {
        const idx = demoProducts.findIndex(x=>Number(x.id)===Number(id));
        if (idx>=0) demoProducts[idx] = {...demoProducts[idx], ...product};
      } else demoProducts.push({id:Date.now(),fecha_creacion:new Date().toISOString(),...product});
    } else if (id) await supabaseUpdate("productos", "id=eq."+encodeURIComponent(id), product);
    else await supabaseInsert("productos", product);
    closeProductModal();
    toast("Producto guardado correctamente.");
    await loadData();
  } catch (err) { console.error(err); toast("No se pudo guardar el producto. Revisa las políticas de Supabase."); }
}

async function deleteProduct(id) {
  if (!confirm("¿Deseas eliminar este producto?")) return;
  try {
    if (CONFIG.demoMode) {
      const idx=demoProducts.findIndex(x=>Number(x.id)===Number(id));
      if(idx>=0) demoProducts.splice(idx,1);
    } else await supabaseDelete("productos","id=eq."+encodeURIComponent(id));
    toast("Producto eliminado.");
    await loadData();
  } catch(err) { console.error(err); toast("No se pudo eliminar."); }
}

function renderUsers() {
  if (!isAdmin()) return;
  $("userTableBody").innerHTML = state.users.map(u => `<tr>
    <td><strong>${escapeHtml(u.usuario||"")}</strong></td><td>${escapeHtml(u.nombre||"")}</td><td>${escapeHtml(u.rol||"Trabajador")}</td>
    <td><span class="badge ${u.activo===false?"off":"ok"}">${u.activo===false?"Inactivo":"Activo"}</span></td>
    <td>${u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString("es-PE") : "—"}</td>
    <td><button class="small-btn" onclick="toggleUser(${Number(u.id)})">${u.activo===false?"Activar":"Desactivar"}</button></td>
  </tr>`).join("");
}

async function toggleUser(id) {
  const u = state.users.find(x=>Number(x.id)===Number(id));
  if (!u) return;
  if (String(u.usuario).toLowerCase() === String(state.currentUser.usuario).toLowerCase()) return toast("No puedes desactivar tu propia cuenta.");
  try {
    const nuevo = !u.activo;
    if (CONFIG.demoMode) u.activo = nuevo;
    else await supabaseUpdate("usuarios","id=eq."+encodeURIComponent(id),{activo:nuevo});
    toast(nuevo ? "Usuario activado." : "Usuario desactivado.");
    await loadData();
  } catch(err){ console.error(err); toast("No se pudo cambiar el estado."); }
}

function switchSection(section) {
  if ((section==="productos" || section==="usuarios") && !isAdmin()) section="catalogo";
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  $(`${section}Section`).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.section===section));
  const titles={catalogo:["Catálogo de productos","Consulta precios y presentaciones."],productos:["Gestión de productos","Administra productos, precios y presentaciones."],usuarios:["Gestión de usuarios","Administra las cuentas del sistema."]};
  $("sectionTitle").textContent=titles[section][0];
  $("sectionSubtitle").textContent=titles[section][1];
  closeMobile();
}

function openMobile(){ document.querySelector(".sidebar").classList.add("open"); $("mobileOverlay").classList.add("show"); }
function closeMobile(){ document.querySelector(".sidebar").classList.remove("open"); $("mobileOverlay").classList.remove("show"); }

async function supabaseRequest(path, options={}) {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) throw new Error("Configura Supabase en config.js");
  const res = await fetch(`${CONFIG.supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers:{"apikey":CONFIG.supabaseAnonKey,"Authorization":`Bearer ${CONFIG.supabaseAnonKey}`,"Content-Type":"application/json","Prefer":"return=representation",...(options.headers||{})}
  });
  if (!res.ok) throw new Error(await res.text());
  const text=await res.text();
  return text ? JSON.parse(text) : [];
}
async function supabaseGet(table, query="select=*"){ return supabaseRequest(`${table}?${query}`); }
async function supabaseInsert(table, data){ return supabaseRequest(table,{method:"POST",body:JSON.stringify(data)}); }
async function supabaseUpdate(table, filter, data){ return supabaseRequest(`${table}?${filter}`,{method:"PATCH",body:JSON.stringify(data)}); }
async function supabaseDelete(table, filter){ return supabaseRequest(`${table}?${filter}`,{method:"DELETE"}); }

function numOrNull(v){ const n=Number(v); return v===""||!Number.isFinite(n)?null:n; }
function numberOrNull(v){ return v===null||v===undefined||v==="" ? null : (Number.isFinite(Number(v)) ? Number(v) : null); }
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function escapeAttr(v){return escapeHtml(v);}
let toastTimer;
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3000);}
window.openProductModal=openProductModal;
window.deleteProduct=deleteProduct;
window.toggleUser=toggleUser;
