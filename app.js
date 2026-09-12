const CONFIG = window.SISTEMA_CONFIG || { demoMode:true, supabaseUrl:"", supabaseAnonKey:"" };

const state = {
  products: [],
  users: [],
  featuredBrands: [],
  featuredBrandsEnabled: true,
  selectedFeaturedBrandId: null,
  currentUser: null,
  selectedCategory: "",
  search: "",
  priceView: "all",
  selectedBrand: "",
  selectedCompany: "",
  catalogPage: 1,
  pageSize: 12,
  adminProductSearch: "",
  adminProductCategory: "",
  customCatalogs: [],
  categorySearch: "",
  categoryImageDraft: "",
  categoryEditingId: null,
  productDetails: {}
};

const demoUsers = [
  { id: 1, usuario: "admin", nombre: "Administrador", rol: "Administrador", password: "admin", activo: true, fecha_registro: "2026-01-01" },
  { id: 2, usuario: "trabajador", nombre: "Trabajador", rol: "Trabajador", password: "1234", activo: true, fecha_registro: "2026-01-02" }
];

const demoProducts = [
  {id:1,categoria:"Abarrotes",nombre:"Arroz",precio_unidad:4.50,precios_mayor:[{Presentacion:"SIX",Precio:25},{Presentacion:"Docena",Precio:48},{Presentacion:"Paquete",Precio:110}],precio_mercado:5,precio_publico:5.50,imagen_url:""},
  {id:2,categoria:"Abarrotes",nombre:"Azúcar",precio_unidad:4.20,precios_mayor:[{Presentacion:"SIX",Precio:24},{Presentacion:"Docena",Precio:46},{Presentacion:"Paquete",Precio:105}],precio_mercado:4.80,precio_publico:5.20,imagen_url:""}
];


const defaultFeaturedBrands = [
  {id:"ally-nestle",nombre:"Nestlé",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=nestle.com.pe&sz=256",orden:1,activo:true,marcas:["Kirma","Nescafé","Milo","Eco","Nesquik","Dog Chow"]},
  {id:"ally-alicorp",nombre:"Alicorp",categoria:"Empresa",imagen_url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Alicorp%20Logo%202023.png",orden:2,activo:true,marcas:["Marsella","Opal","Bolívar","Patito","Sello de Oro","Manty","Cocinero","Primor","Don Vittorio"]},
  {id:"ally-rinti",nombre:"Rinti S.A.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=rinti.com.pe&sz=256",orden:3,activo:true,marcas:["Ricocan","Ricocat","Michicat","Supercat"]},
  {id:"ally-pg",nombre:"Procter & Gamble",categoria:"Empresa",imagen_url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/P%26G%20logo.svg",orden:4,activo:true,marcas:["Ace","Ariel"]},
  {id:"ally-molitalia",nombre:"Molitalia S.A.",categoria:"Empresa",imagen_url:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo%20molitalia.png",orden:5,activo:true,marcas:["Molitalia","Mimaskot","Nutrican"]},
  {id:"ally-altomayo",nombre:"Altomayo Perú S.A.C.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=altomayo.com.pe&sz=256",orden:6,activo:true,marcas:["Altomayo"]},
  {id:"ally-romex",nombre:"Romex",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=romex.com.pe&sz=256",orden:7,activo:true,marcas:["Cafetal"]},
  {id:"ally-sibarita",nombre:"Sibarita",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=sibarita.com.pe&sz=256",orden:8,activo:true,marcas:["Sibarita","Panquita","Amarillín","Ajos"]},
  {id:"ally-lopesa",nombre:"Lopesa Industrial S.A.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=lopesa.com.pe&sz=256",orden:9,activo:true,marcas:["Lopesa"]},
  {id:"ally-donjulio",nombre:"Molino Don Julio S.A.C.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=molinodonjulio.com&sz=256",orden:10,activo:true,marcas:["Caballero"]},
  {id:"ally-sanfrancisco",nombre:"Molino San Francisco S.A.C.",categoria:"Empresa",imagen_url:"",orden:11,activo:true,marcas:["Caserita"]},
  {id:"ally-rubio",nombre:"Inversiones Rubio S.A.C.",categoria:"Empresa",imagen_url:"",orden:12,activo:true,marcas:["Rinus"]},
  {id:"ally-chiclayo",nombre:"Molino Chiclayo",categoria:"Empresa",imagen_url:"",orden:13,activo:true,marcas:["Taipa"]},
  {id:"ally-faraon",nombre:"Productos Faraón S.A.C.",categoria:"Empresa",imagen_url:"",orden:14,activo:true,marcas:["Faraón"]},
  {id:"ally-saman",nombre:"Molino Samán S.R.L.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=molinosaman.com.pe&sz=256",orden:15,activo:true,marcas:["Pacasmayo"]},
  {id:"ally-cartavio",nombre:"Complejo Agroindustrial Cartavio S.A.A.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=coazucar.com&sz=256",orden:16,activo:true,marcas:["Dulce Norte"]},
  {id:"ally-casagrande",nombre:"Casa Grande S.A.A.",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=coazucar.com&sz=256",orden:17,activo:true,marcas:["Casa Grande"]},
  {id:"ally-zunda",nombre:"Zunda América S.A.C.",categoria:"Empresa",imagen_url:"",orden:18,activo:true,marcas:["Doffy"]},
  {id:"ally-agrinsa",nombre:"Agroindustrias Integradas S.A.",categoria:"Empresa",imagen_url:"",orden:19,activo:true,marcas:["Real"]},
  {id:"ally-aopsa",nombre:"Agroindustrias Oleaginosas del Perú S.A.",categoria:"Empresa",imagen_url:"",orden:20,activo:true,marcas:["Unisol"]},
  {id:"ally-alpamayo",nombre:"Industrias Alpamayo S.A.",categoria:"Empresa",imagen_url:"",orden:21,activo:true,marcas:["Mirasol","Alpha"]},
  {id:"ally-espino",nombre:"Industrias del Espino S.A.",categoria:"Empresa",imagen_url:"",orden:22,activo:true,marcas:["Tondero"]},
  {id:"ally-ipag",nombre:"Industria Peruana de Aceites y Grasas S.R.L.",categoria:"Empresa",imagen_url:"",orden:23,activo:true,marcas:["Deleite","Salsero"]},
  {id:"ally-rr",nombre:"Productos Industriales R & R S.A.C.",categoria:"Empresa",imagen_url:"",orden:24,activo:true,marcas:["Patrona"]},
  {id:"ally-cielo",nombre:"Alimentos Cielo",categoria:"Empresa",imagen_url:"https://www.google.com/s2/favicons?domain=alimentoscielo.com&sz=256",orden:25,activo:true,marcas:["Cielo"]},
  {id:"ally-anita",nombre:"Anita Foods",categoria:"Empresa",imagen_url:"",orden:26,activo:true,marcas:["Anita"]},
  {id:"ally-granodeoro",nombre:"Agroindustria Santa María S.A.C.",categoria:"Empresa",imagen_url:"",orden:27,activo:true,marcas:["Grano de Oro"]},
];
const COMPANY_ALIASES = defaultFeaturedBrands.reduce((acc,x)=>{acc[x.nombre]=x.marcas||[];return acc;},{});
const PRODUCT_COMPANY_MAP = {
  "Kirma 7 g":"Nestlé","Kirma 14 g":"Nestlé","Nescafé 7 g":"Nestlé","Nescafé 14 g":"Nestlé","Milo":"Nestlé","Eco":"Nestlé","Nesquik 13 g":"Nestlé","Dog Chow Adulto 15kg":"Nestlé","Dog Chow Cachorro":"Nestlé",
  "Sello de Oro 45 g":"Alicorp","Sello de Oro 90 g":"Alicorp","Manty 90 g":"Alicorp","Manty 300 g":"Alicorp","Opan 1 kg":"Alicorp","Sello de Oro 1 kg":"Alicorp","Cocinero 900 ml":"Alicorp","Primor 900 ml":"Alicorp","Primor Premium 900 ml":"Alicorp","Don Vittorio Tallarín 950 g":"Alicorp","Don Vittorio Tallarín 450 g":"Alicorp","Marsella 140 g":"Alicorp","Marsella 330 g":"Alicorp","Marsella 420 g":"Alicorp","Marsella 730 g":"Alicorp","Marsella 2 kg":"Alicorp","Marsella 4 kg":"Alicorp","Marsella 13.5 kg":"Alicorp","Opal 140 g":"Alicorp","Opal 330 g":"Alicorp","Opal 430 g":"Alicorp","Opal 730 g":"Alicorp","Opal 2.4 kg":"Alicorp","Opal 4 kg":"Alicorp","Bolívar 140 g":"Alicorp","Bolívar 330 g":"Alicorp","Bolívar 430 g":"Alicorp","Bolívar 730 g":"Alicorp","Bolívar 2.4 kg":"Alicorp","Bolívar 4.2 kg":"Alicorp","Patito 140 g":"Alicorp","Patito 1 kg":"Alicorp",
  "Ricocan Adulto 22 kg":"Rinti S.A.","Ricocan Cachorro 22 kg":"Rinti S.A.","Ricocan Adulto 15 kg":"Rinti S.A.","Ricocan Cachorro 15 kg":"Rinti S.A.","Ricocat Adulto 9 kg":"Rinti S.A.","Ricocat Adulto 18 kg":"Rinti S.A.","Ricocat Bebé 15 kg":"Rinti S.A.","Michicat Adulto 9 kg":"Rinti S.A.","Michicat Adulto 18 kg":"Rinti S.A.","Supercat Adulto 9 kg":"Rinti S.A.","Supercat Adulto 15 kg":"Rinti S.A.",
  "MiMascot Adulto 15 kg":"Molitalia S.A.","Nutrican Adulto 27 kg":"Molitalia S.A.","Molitalia Tallarín 450 g":"Molitalia S.A.","Molitalia Tallarín 950 g":"Molitalia S.A.","Molitalia Sopa":"Molitalia S.A.","Molitalia Surtido":"Molitalia S.A.","Cabello de Ángel Molitalia":"Molitalia S.A.","Tornillo de Color Molitalia":"Molitalia S.A.",
  "Ace 280 g":"Procter & Gamble","Ace 380 g":"Procter & Gamble","Ace 700 g":"Procter & Gamble","Ariel 300 g":"Procter & Gamble","Ariel 400 g":"Procter & Gamble","Ariel 720 g":"Procter & Gamble",
  "Altomayo 7 g":"Altomayo Perú S.A.C.","Altomayo 14 g":"Altomayo Perú S.A.C.","Altomayo 45 g":"Altomayo Perú S.A.C.","Altomayo 140 g":"Altomayo Perú S.A.C.",
  "Cafetal instantáneo negro 8 g":"Romex","Cafetal instantáneo negro 15 g":"Romex","Cafetal instantáneo amarillo 9 g":"Romex",
  "Palillo Chico":"Sibarita","Palillo Grande":"Sibarita","sibarita Chica":"Sibarita","sibarita Grande":"Sibarita","Tuco Chico":"Sibarita","Tuco Grande":"Sibarita","Pimienta y Comino Cibarita Chico":"Sibarita","Pimienta y Comino Cibarita Grande":"Sibarita","Panquita":"Sibarita","Amarillín":"Sibarita","Ajos":"Sibarita",
  "Orégano Lopesa":"Lopesa Industrial S.A.","Pimienta y Comino Lopesa":"Lopesa Industrial S.A.",
  "Caballero Verde Económico":"Molino Don Julio S.A.C.","Caballero Rojo":"Molino Don Julio S.A.C.","Caballero Celeste":"Molino Don Julio S.A.C.","Caballero Dorado":"Molino Don Julio S.A.C.",
  "Caserita Extra":"Molino San Francisco S.A.C.","Caserita RAM":"Molino San Francisco S.A.C.","Rinus":"Inversiones Rubio S.A.C.","Taipa":"Molino Chiclayo","Pacasmayo":"Molino Samán S.R.L.","Faraón":"Productos Faraón S.A.C.","Azúcar Dulce Norte":"Complejo Agroindustrial Cartavio S.A.A.","Azúcar Casa Grande":"Casa Grande S.A.A.",
  "Real 800 ml":"Agroindustrias Integradas S.A.","Real 900 ml":"Agroindustrias Integradas S.A.","Real 200 ml":"Agroindustrias Integradas S.A.","Unisol 900 ml":"Agroindustrias Oleaginosas del Perú S.A.","Mirasol 1 litro":"Industrias Alpamayo S.A.","Alpha 3 litros":"Industrias Alpamayo S.A.","Alpha 5 litros":"Industrias Alpamayo S.A.","Tondero 1 litro":"Industrias del Espino S.A.","Deleite 1 litro":"Industria Peruana de Aceites y Grasas S.R.L.","Salsero 500 ml":"Industria Peruana de Aceites y Grasas S.R.L.","Patrona 1 litro":"Productos Industriales R & R S.A.C.",
  "Cielo 900 ml":"Alimentos Cielo","Cielo Tallarín":"Alimentos Cielo","Anita Tallarín":"Anita Foods","Grano de Oro Tallarín":"Agroindustria Santa María S.A.C.","Doffy 140 g":"Zunda América S.A.C.","Doffy 1 kg":"Zunda América S.A.C.","Doffy 15 kg":"Zunda América S.A.C."
};
const PRODUCT_COMPANY_BY_NORMALIZED = Object.fromEntries(Object.entries(PRODUCT_COMPANY_MAP).map(([k,v])=>[normalizeBrandName(k),v]));
function getEffectiveCompany(p){
  const direct=String(p?.empresa||'').trim();
  if(direct) return direct;
  return PRODUCT_COMPANY_BY_NORMALIZED[normalizeBrandName(String(p?.nombre||''))] || '';
}


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
  $("categorySelect").onchange = e => { state.selectedCategory = e.target.value; state.selectedBrand = ""; state.selectedCompany = ""; buildCategories(); renderCatalog(); };
  $("priceView").onchange = e => { state.priceView = e.target.value; state.catalogPage=1; renderCatalog(); };
  $("newProductBtn").onclick = () => openProductModal();
  $("selectAllProductsBtn").onclick = () => setAllProductChecks(true);
  $("deselectProductsBtn").onclick = () => setAllProductChecks(false);
  $("selectAllProducts").onchange = e => setAllProductChecks(e.target.checked);
  $("editSelectedBtn").onclick = editSelectedProduct;
  $("deleteSelectedBtn").onclick = deleteSelectedProducts;
  $("newProductBtn2").onclick = () => openProductModal();
  $("adminProductSearch").oninput = e => { state.adminProductSearch = e.target.value; renderProductTable(); };
  $("adminProductCategory").onchange = e => { state.adminProductCategory = e.target.value; renderProductTable(); };
  $("clearAdminProductFilters").onclick = () => { state.adminProductSearch = ""; state.adminProductCategory = ""; $("adminProductSearch").value = ""; $("adminProductCategory").value = ""; renderProductTable(); };
  $("addCatalogBtn").onclick = addCatalog;
  $("categoryForm").addEventListener("submit", saveCategoryModal);
  $("closeCategoryModalBtn").onclick = closeCategoryModal;
  $("cancelCategoryModalBtn").onclick = closeCategoryModal;
  $("categoryImageFile").addEventListener("change", handleCategoryImageFile);
  $("removeCategoryImageBtn").onclick = () => { state.categoryImageDraft=""; $("categoryImageFile").value=""; renderCategoryImageDraft(); };
  renderCatalogAdmin();
  $("generateImportBtn").onclick = generateImportPreview;
  $("addPresentationBtn").onclick = () => addPresentationRow();
  $("productForm").addEventListener("submit", saveProduct);
  bindFeaturedBrandEvents();
  bindImageEditor();
  initImageFolder();
  document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeProductModal));
  document.querySelectorAll("[data-close-detail]").forEach(el => el.addEventListener("click", closeProductDetail));
  $("detailEditBtn").onclick = () => { const id=$("detailEditBtn").dataset.id; const p=state.products.find(x=>Number(x.id)===Number(id)); closeProductDetail(); if(!p)return; openProductEditorByCategory(id); };
  $("saveTextDetailsBtn").onclick = saveProductTextDetails;
  $("addDetailPresentationBtn").onclick = addDetailEditorPresentation;
  $("closeTextEditorBtn").onclick = closeTextEditor;
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
function showApp(withAccessTransition=false) {
  try { state.customCatalogs = JSON.parse(localStorage.getItem("sp_custom_catalogs") || "[]"); } catch { state.customCatalogs = []; }
  const finish = () => {
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    $("userName").textContent = state.currentUser.nombre || state.currentUser.usuario;
    $("userRole").textContent = state.currentUser.rol || "Trabajador";
    $("userInitial").textContent = (state.currentUser.nombre || state.currentUser.usuario || "U").charAt(0).toUpperCase();
    document.querySelectorAll(".admin-only").forEach(el => { el.style.display = isAdmin() ? "flex" : "none"; });
    $("appView").classList.toggle("admin-mode", isAdmin());
    switchSection("catalogo");
    loadData();
  };
  if (!withAccessTransition) return finish();

  const overlay=$("accessTransition");
  const role=isAdmin() ? "Administrador" : "Trabajador";
  const name=state.currentUser.nombre || state.currentUser.usuario || role;
  $("accessTitle").textContent = "LOGIN EXITOSO";
  $("accessWelcome").textContent = "Bienvenido, " + name;
  $("accessStatus").textContent = role==="Administrador" ? "Accediendo al panel de administrador..." : "Accediendo al sistema...";
  overlay.classList.remove("hidden","is-closing");

  const bar=$("accessProgressBar") || overlay.querySelector(".access-progress span");
  const pct=$("accessPercent");
  if(bar) bar.style.width="0%";
  if(pct) pct.textContent="0%";

  const started=performance.now();
  const duration=3000;
  const tick=()=>{
    const progress=Math.min(100, Math.round(((performance.now()-started)/duration)*100));
    if(bar) bar.style.width=progress+"%";
    if(pct) pct.textContent=progress+"%";
    if(progress<100) requestAnimationFrame(tick);
    else {
      finish();
      window.setTimeout(() => overlay.classList.add("is-closing"), 120);
      window.setTimeout(() => overlay.classList.add("hidden"), 850);
    }
  };
  requestAnimationFrame(tick);
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
    showApp(true);
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

  // Cada módulo se carga por separado. Un fallo en usuarios, aliados o
  // cualquier tabla auxiliar NO debe dejar vacío el catálogo principal.
  let productError = null;
  try {
    state.products = CONFIG.demoMode ? [...demoProducts] : await supabaseGet("productos", "select=*");
    state.products = state.products.map(normalizeProduct);
    await loadProductDetails();
  } catch (err) {
    productError = err;
    state.products = [];
    console.error("Error cargando productos:", err);
  }

  // Las categorías son una tabla maestra de Supabase. Si todavía está vacía,
  // usamos las categorías presentes en productos como respaldo visual, sin escribir nada
  // automáticamente en la base de datos.
  try {
    state.categories = CONFIG.demoMode ? [] : await supabaseGet("categorias", "select=id,nombre,imagen_url,fecha_creacion,fecha_actualizacion,activo&order=nombre.asc");
    state.categoryLoadError = null;
  } catch (err) {
    state.categories = [];
    state.categoryLoadError = err;
    console.error("Error cargando categorías:", err);
  }

  if (isAdmin()) {
    try {
      state.users = CONFIG.demoMode ? [...demoUsers] : await supabaseGet("usuarios", "select=*");
    } catch (err) {
      state.users = [];
      console.error("Error cargando usuarios:", err);
      // No detener el catálogo por RLS/permisos de la tabla usuarios.
      toast("Catálogo cargado. No se pudieron cargar los usuarios de Supabase.");
    }
  }

  try {
    await loadFeaturedBrands();
  } catch (err) {
    console.error("Error cargando aliados:", err);
    state.featuredBrands = [];
    state.featuredBrandsEnabled = false;
  }

  buildCategories();
  buildPriceFilter();
  buildAdminProductCategoryFilter();
  renderCatalog();
  try { renderBrandStrip(); } catch(err) { console.error("Error renderizando aliados:",err); }
  if (isAdmin()) { try { renderUsers(); } catch(err){console.error(err);} try { renderProductTable(); } catch(err){console.error(err);} try { renderFeaturedBrandsAdmin(); } catch(err){console.error(err);} }

  if (productError) {
    const msg = String(productError?.message || productError || "Error desconocido").replace(/\s+/g," ").slice(0,220);
    toast("No se pudieron cargar los productos: " + msg);
  }
  $("loading").classList.add("hidden");
  // Seguridad visual: nunca dejar el indicador visible si el catálogo ya fue renderizado.
  requestAnimationFrame(()=>$("loading")?.classList.add("hidden"));
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
  const normalizeRow = (x, fallbackName) => ({
    Presentacion: String(x?.Presentacion ?? x?.presentacion ?? x?.nombre ?? fallbackName ?? "").trim(),
    Precio: numberOrNull(x?.Precio ?? x?.precio),
    PrecioMercado: numberOrNull(x?.PrecioMercado ?? x?.precio_mercado ?? x?.mercado),
    PrecioPublico: numberOrNull(x?.PrecioPublico ?? x?.precio_publico ?? x?.publico)
  });
  if (Array.isArray(data)) {
    return data.map(x => normalizeRow(x)).filter(x => x.Presentacion);
  }
  if (typeof data === "object") {
    return Object.entries(data).map(([key,val]) => normalizeRow({Precio:val}, presentationLabelFromKey(key))).filter(x => x.Presentacion);
  }
  return [];
}

function presentationLabelFromKey(key) {
  const k = String(key || "").trim();
  const map = { six:"SIX", SIX:"SIX", docena:"Docena", media_docena:"Media docena", tira:"Tira", paquete:"Paquete", bolsa:"Bolsa", caja:"Caja", saco:"Saco", plancha:"Plancha", display:"Display", pack:"Pack", bulto:"Bulto" };
  return map[k] || map[k.toLowerCase()] || k;
}

function getCategoryNames(){
  const fromTable=(state.categories||[])
    .map(c=>canonicalCategoryName(c?.nombre))
    .filter(Boolean);
  const fromProducts=state.products
    .map(p=>canonicalCategoryName(p?.categoria))
    .filter(Boolean);
  // En producción, Supabase es la única fuente maestra de categorías.
  // No mezclar valores guardados en localStorage porque pueden ser nombres
  // antiguos (por ejemplo "Arro") y terminar mostrando categorías duplicadas
  // o sin ID, cuyos botones quedan bloqueados.
  const source=(!CONFIG.demoMode && fromTable.length) ? fromTable : (CONFIG.demoMode ? [...fromProducts,...(state.customCatalogs||[])] : fromProducts);
  const unique=new Map();
  source.forEach(name=>{
    name=canonicalCategoryName(name);
    const key=categoryKey(name);
    if(key && !unique.has(key)) unique.set(key,String(name).trim());
  });
  return [...unique.values()].sort((a,b)=>a.localeCompare(b,"es",{sensitivity:"base"}));
}
function buildCategories() {
  const cats = getCategoryNames();
  $("categoryList").innerHTML = `<button class="category-btn ${state.selectedCategory===""?"active":""}" data-cat=""><span class="category-icon category-icon-all" aria-hidden="true"></span><span class="category-label">Todas</span></button>` +
    cats.map(c => `<button class="category-btn ${state.selectedCategory===c?"active":""}" data-cat="${escapeAttr(c)}">${categoryImageMarkup(c,"category-menu-image")}<span class="category-label">${escapeHtml(c)}</span></button>`).join("");
  $("categorySelect").innerHTML = `<option value="">Todas las categorías</option>` + cats.map(c=>`<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  $("categorySelect").value = state.selectedCategory;
  $("breadcrumbCategory").textContent = state.selectedCategory || "Todas";
  document.querySelectorAll(".category-btn").forEach(b => b.onclick = () => {
    state.selectedCategory = canonicalCategoryName(b.dataset.cat);
    state.selectedCompany = "";
    state.selectedCompanyId = null;
    state.selectedCompanyName = "";
    state.selectedBrand = "";
    state.catalogPage = 1;
    $("categorySelect").value = state.selectedCategory;
    buildCategories();
    renderCatalog();
    closeMobile();
  });
  buildAdminProductCategoryFilter();
  populateProductCategorySelect();
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

const BRAND_PATTERNS = [
  // Detergentes
  ["Detergentes", ["Marsella","Opal","Bolívar","Ace","Ariel","Doff","Patito"]],
  // Arroz
  ["Arroz", ["Caballero Carmelo","Taipá","Faraón","Rhinos","Pacas Maya","Pacasmayo","Cacerita","Costeño","Paisana","Molino Rojo"]],
  // Margarinas
  ["Margarinas", ["Sello de Oro","Manty","Mandi","Dorina"]],
  // Fideos
  ["Fideos", ["Cielo","Grana de Oro","Anita","Molitalia","Don Vittorio","Nicolini","Lavaggi","Espiga de Oro"]],
  // Café, cocoa y filtrantes
  ["Café", ["Cafetal","Eco","Altomayo","Kirma","Nescafé","Milo","Nesquik"]],
  ["Café, Cocoa y Filtrante", ["Cafetal","Eco","Altomayo","Kirma","Nescafé","Milo","Nesquik"]],
  // Condimentos
  ["Condimentos", ["Lopeza","Cibarita","Sibarita","Ajinomoto"]],
  // Aceites
  ["Aceites", ["Primor","Cocinero","Capri","Cil","Ideal","Friol","Sao"]],
  // Azúcar
  ["Azúcar", ["Casa Grande","Cartavio","Paramonga","Dulce Norte"]],
  // Comida para animales
  ["Comida Para Animales", ["Ricocan","Mimaskot","Canbo","Ricocat","Supercat"]]
];
const BRAND_ALIASES = [
  "Marsella","Opal","Bolívar","Ace","Ariel","Doff","Patito","Caballero Carmelo","Taipá","Faraón","Rhinos","Pacas Maya","Pacasmayo","Cacerita","Costeño","Paisana","Molino Rojo",
  "Sello de Oro","Manty","Mandi","Dorina","Cielo","Grana de Oro","Anita","Molitalia","Don Vittorio","Nicolini","Lavaggi","Espiga de Oro","Cafetal","Eco","Altomayo","Kirma","Nescafé","Milo","Nesquik",
  "Lopeza","Cibarita","Sibarita","Ajinomoto","Primor","Cocinero","Capri","Cil","Ideal","Friol","Sao","Casa Grande","Cartavio","Paramonga","Dulce Norte","Ricocan","Mimaskot","Canbo","Ricocat","Supercat"
];
function normalizeBrandName(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
function getBrandsForCategory(){
  const base=state.products.filter(p=>!state.selectedCategory||sameCategory(p.categoria,state.selectedCategory));
  const found=[];
  const patterns=BRAND_PATTERNS.filter(([cat])=>!state.selectedCategory||normalizeBrandName(cat)===normalizeBrandName(state.selectedCategory));
  const candidates=[...new Set(patterns.flatMap(x=>x[1]))];
  candidates.forEach(b=>{if(base.some(p=>normalizeBrandName(p.nombre).includes(normalizeBrandName(b)))) found.push(b);});
  return ["Todas",...found];
}
function detectCatalogBrands(){
  const detected=[];
  for(const p of state.products){
    const cat=(p.categoria||"").trim();
    for(const brand of BRAND_ALIASES){
      if(normalizeBrandName(p.nombre).includes(normalizeBrandName(brand))){
        const key=normalizeBrandName(brand)+"|"+normalizeBrandName(cat);
        if(!detected.some(x=>x.key===key)) detected.push({key,nombre:brand,categoria:cat});
      }
    }
  }
  return detected;
}
async function ensureFeaturedBrandsFromCatalog(){
  if(CONFIG.demoMode||!isAdmin()) return;
  const detected=detectCatalogBrands();
  if(!detected.length) return;
  const existingKeys=new Set(state.featuredBrands.map(b=>normalizeBrandName(b.nombre)+"|"+normalizeBrandName(b.categoria)));
  let next=Math.max(0,...state.featuredBrands.map(b=>Number(b.orden)||0));
  const missing=detected.filter(x=>!existingKeys.has(x.key));
  if(!missing.length) return;
  for(const x of missing){
    next++;
    try{
      const rows=await supabaseInsert("marcas_destacadas",{nombre:x.nombre,categoria:x.categoria||null,imagen_url:null,orden:next,activo:true});
      const row=Array.isArray(rows)?rows[0]:rows;
      state.featuredBrands.push({...x, id:row?.id||("auto-"+Date.now()+"-"+next), orden:next, activo:true, imagen_url:""});
    }catch(err){console.warn("No se pudo crear marca automática",x,err);}
  }
  state.featuredBrandsEnabled=state.featuredBrands.some(x=>x.activo!==false);
}
function renderBrandStrip() {
  const strip = $("brandStrip");
  if(!strip) return;

  // Catálogo público: una sola sección de Nuestros aliados.
  // Las empresas y sus logos vienen directamente de empresas_aliadas.
  const allies = (state.featuredBrands || [])
    .filter(x => x && x.activo !== false && String(x.nombre || "").trim())
    .sort((a,b) => (Number(a.orden)||0) - (Number(b.orden)||0));

  strip.innerHTML = `
    <div class="brand-strip-featured-title">Nuestros aliados</div>
    <div class="allies-auto-viewport" aria-label="Nuestros aliados">
      <div class="allies-auto-track"></div>
    </div>`;

  const viewport = strip.querySelector('.allies-auto-viewport');
  const track = strip.querySelector('.allies-auto-track');
  if(!track) return;

  if(!allies.length){
    track.innerHTML = '<div class="brand-strip-empty">No hay aliados registrados.</div>';
    return;
  }

  // Se crean las imágenes con DOM para que data:image/...;base64,...
  // guardado en Supabase se utilice directamente como src.
  const makeCard = (ally) => {
    const card=document.createElement('button');
    card.type='button';
    card.className='ally-auto-card';
    card.title=ally.nombre;
    card.dataset.allyId=String(ally.id ?? '');

    const media=document.createElement('span');
    media.className='ally-auto-media';
    const src=String(ally.logo_url || ally.imagen_url || '').trim();
    if(src){
      const img=document.createElement('img');
      img.src=src;
      img.alt=ally.nombre;
      img.loading='eager';
      img.decoding='async';
      img.onerror=()=>{
        media.replaceChildren();
        const fallback=document.createElement('span');
        fallback.className='ally-logo-fallback';
        fallback.textContent=String(ally.nombre||'A').trim().slice(0,1).toUpperCase();
        media.appendChild(fallback);
      };
      media.appendChild(img);
    }else{
      const fallback=document.createElement('span');
      fallback.className='ally-logo-fallback';
      fallback.textContent=String(ally.nombre||'A').trim().slice(0,1).toUpperCase();
      media.appendChild(fallback);
    }
    card.appendChild(media);

    card.onclick=()=>{
      state.selectedCompanyId=ally.id;
      state.selectedCompanyName=ally.nombre;
      state.selectedCompany=ally.nombre;
      state.selectedCategory="";
      state.selectedBrand="";
      state.search="";
      const searchInput=$("searchInput"); if(searchInput) searchInput.value="";
      state.catalogPage=1;
      buildCategories();
      renderCatalog();
      track.querySelectorAll('.ally-auto-card').forEach(x=>x.classList.remove('active'));
      card.classList.add('active');
    };
    return card;
  };

  // Duplicamos la secuencia para que el movimiento hacia la izquierda sea continuo.
  const firstSet=allies.map(makeCard);
  const secondSet=allies.map(makeCard);
  track.replaceChildren(...firstSet, ...secondSet);

  // La mitad exacta del track corresponde al primer conjunto.
  // CSS anima translateX(-50%) y vuelve a iniciar sin salto visible.
  track.style.setProperty('--ally-count', String(allies.length));
  track.style.animationDuration = `${Math.max(18, allies.length * 3.2)}s`;

  // Reinicia la animación solo cuando se vuelve a renderizar la sección.
  // No se reinicia al hacer clic: renderCatalog mantiene el carrusel separado
  // de la selección visual siempre que sea posible.
  if(viewport) viewport.dataset.ready='true';
}

async function loadFeaturedBrands(){
  if(CONFIG.demoMode){
    state.featuredBrands=structuredClone(defaultFeaturedBrands);
    state.featuredBrandsEnabled=true;
    return;
  }

  // Las empresas guardadas en Supabase tienen prioridad. Los aliados que aún
  // no estén registrados se muestran desde el catálogo maestro local para que
  // el administrador pueda completarlos y guardarlos explícitamente.
  let companies=[];
  let brands=[];
  let companyError=null;
  try{
    companies=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&order=orden.asc");
  }catch(err){
    companyError=err;
    console.error("Error cargando empresas_aliadas:",err);
  }
  try{
    brands=await supabaseGet("marcas","select=id,nombre,empresa_id,logo_url,orden,activo&order=orden.asc");
  }catch(err){
    console.warn("No se pudieron cargar las marcas relacionadas; se mostrarán igualmente los logos de empresas.",err);
    brands=[];
  }

  if(companyError){
    state.featuredBrands=[];
    state.featuredBrandsEnabled=false;
    const strip=$("brandStrip");
    if(strip) strip.innerHTML=`<div class="brand-strip-featured-title">Nuestros aliados</div><div class="brand-strip-empty">No se pudieron cargar los aliados desde Supabase.</div>`;
    return;
  }

  const normCompany=n=>normalizeBrandName(String(n||"")).replace(/s\.?a\.?c?\.?|s\.?r\.?l\.?|s\.?a\.?a\.?/g,"").replace(/[^a-z0-9]/g,"");
  const existingByKey=new Map(companies.map(c=>[normCompany(c.nombre),c]));
  const defaultByKey=new Map(defaultFeaturedBrands.map(c=>[normCompany(c.nombre),c]));
  const merged=[];
  const used=new Set();

  // Primero respetar exactamente lo que existe en Supabase.
  for(const c of companies){
    const d=defaultByKey.get(normCompany(c.nombre));
    const related=brands.filter(b=>Number(b.empresa_id)===Number(c.id)).map(b=>b.nombre).filter(Boolean);
    merged.push({
      ...c,
      imagen_url:String(c.logo_url||""),
      orden:Number(c.orden||d?.orden||merged.length+1),
      activo:c.activo!==false,
      categoria:"Empresa",
      marcas:related.length?related:(d?.marcas||[]),
      _dbId:Number(c.id)
    });
    used.add(normCompany(c.nombre));
  }

  // Completar los aliados faltantes sin escribir nada en Supabase al cargar.
  for(const d of defaultFeaturedBrands){
    const key=normCompany(d.nombre);
    if(used.has(key)) continue;
    merged.push({...structuredClone(d),imagen_url:"",_new:true});
    used.add(key);
  }

  merged.sort((a,b)=>Number(a.orden||0)-Number(b.orden||0));
  // Renumeración visual estable 1..27, sin cambiar Supabase hasta guardar.
  merged.forEach((c,i)=>{ if(!Number(c.orden)) c.orden=i+1; });
  state.featuredBrands=merged;
  state.featuredBrandsEnabled=state.featuredBrands.some(x=>x.activo!==false);
}

async function generateFeaturedBrandsFromCatalog(){
  await ensureFeaturedBrandsFromCatalog();
  renderFeaturedBrandsAdmin();
  renderCatalog();
  toast("Marcas detectadas desde tu catálogo. Revisa y guarda si deseas cambiar orden o imágenes.");
}

function bindFeaturedBrandEvents(){
  const bulk=$("generateBrandsBtn"); if(bulk) bulk.onclick=generateFeaturedBrandsFromCatalog;
  const add=$("addBrandBtn"); if(add) add.onclick=()=>{const next=state.featuredBrands.reduce((m,b)=>Math.max(m,Number(b.orden||0)),0)+1;const b={id:"new-"+Date.now(),nombre:"Nueva marca",categoria:"",imagen_url:"",orden:next,activo:true,_new:true,_dirty:true};state.featuredBrands.push(b);selectFeaturedBrand(b.id);renderFeaturedBrandsAdmin();};
  const save=$("saveBrandsBtn"); if(save) save.onclick=saveFeaturedBrands;
  const enabled=$("featuredBrandsEnabled"); if(enabled) enabled.onchange=()=>{state.featuredBrandsEnabled=enabled.checked;renderWorkerBrandPreview();};
  const folderBtn=$("configureImageFolderBtn"); if(folderBtn) folderBtn.onclick=configureImageFolder;
  const change=$("brandChangeImageBtn"); if(change) change.onclick=()=>pickImageSmart("logo");
  const file=$("brandImageFile"); if(file) file.onchange=handleFeaturedBrandImageFile;
  const url=$("brandImageUrlInput"); if(url) url.oninput=()=>{const b=getSelectedFeaturedBrand();if(!b)return;b._dirty=true;b.imagen_url=url.value.trim();renderBrandAdminCardImages();renderFeaturedBrandEditor();renderWorkerBrandPreview();};
  const name=$("brandNameInput"); if(name) name.oninput=()=>{const b=getSelectedFeaturedBrand();if(!b)return;b._dirty=true;b.nombre=name.value.trim()||"Nueva marca";renderBrandAdminCardImages();renderWorkerBrandPreview();};
  const cat=$("brandCategoryInput"); if(cat) cat.oninput=()=>{const b=getSelectedFeaturedBrand();if(b){b._dirty=true;b.categoria=cat.value.trim();}};
  const rm=$("brandRemoveBgBtn"); if(rm) rm.onclick=()=>transformFeaturedBrandImage("removebg");
  const rot=$("brandRotateBtn"); if(rot) rot.onclick=()=>transformFeaturedBrandImage("rotate");
  const del=$("brandDeleteBtn"); if(del) del.onclick=deleteSelectedFeaturedBrand;
}
function getSelectedFeaturedBrand(){return state.featuredBrands.find(b=>String(b.id)===String(state.selectedFeaturedBrandId));}
function selectFeaturedBrand(id){state.selectedFeaturedBrandId=id;renderFeaturedBrandEditor();}
function renderFeaturedBrandsAdmin(){
  const grid=$("brandAdminGrid");if(!grid)return;
  const brands=[...state.featuredBrands].filter(b=>!b._deleted).sort((a,b)=>Number(a.orden||0)-Number(b.orden||0));
  const countBadge=$("allyCountBadge"); if(countBadge) countBadge.textContent=`${brands.length} aliados`;
  grid.innerHTML=brands.map((b,i)=>{const bs=(b.marcas||COMPANY_ALIASES[b.nombre]||[]);return `<article class="brand-admin-card ally-admin-card ${String(b.id)===String(state.selectedFeaturedBrandId)?'selected':''}" data-id="${escapeAttr(b.id)}"><button class="brand-drag" type="button" title="Seleccionar">⠿</button><button class="brand-card-delete" type="button" title="Eliminar">×</button><div class="brand-card-image">${b.imagen_url?`<img src="${escapeAttr(b.imagen_url)}" alt="Logo ${escapeAttr(b.nombre)}">`:`<span>${escapeHtml(String(b.nombre||"E").slice(0,1).toUpperCase())}</span>`}</div><label>Empresa<input class="brand-card-name" value="${escapeAttr(b.nombre||"")}"></label><div class="ally-card-brands"><span>Marcas relacionadas</span><strong>${escapeHtml(bs.join(" · ")||"Revisar catálogo")}</strong></div><label>Orden<input class="brand-card-order" type="number" min="1" value="${Number(b.orden||i+1)}"></label><button class="small-btn" type="button">✎ Editar logo</button><button class="small-btn brand-magic" type="button">✦ Quitar fondo</button><button class="small-btn ally-save-one" type="button">▣ Guardar este aliado</button></article>`;}).join("");
  grid.querySelectorAll(".brand-admin-card").forEach(card=>{
    const id=card.dataset.id,b=state.featuredBrands.find(x=>String(x.id)===id);if(!b)return;
    card.onclick=e=>{if(e.target.matches("input,button"))return;selectFeaturedBrand(id);renderFeaturedBrandsAdmin();};
    card.querySelector(".brand-card-delete").onclick=e=>{e.stopPropagation();state.selectedFeaturedBrandId=id;deleteSelectedFeaturedBrand();};
    card.querySelector(".brand-card-name").oninput=e=>{b._dirty=true;b.nombre=e.target.value;renderWorkerBrandPreview();};
    b.categoria="Empresa";
    card.querySelector(".brand-card-order").oninput=e=>{b._dirty=true;b.orden=Number(e.target.value)||1;renderWorkerBrandPreview();};
    card.querySelectorAll(".small-btn")[0].onclick=e=>{e.stopPropagation();selectFeaturedBrand(id);pickImageSmart("logo");};
    card.querySelectorAll(".small-btn")[1].onclick=e=>{e.stopPropagation();selectFeaturedBrand(id);transformFeaturedBrandImage("removebg");};
    card.querySelector(".ally-save-one").onclick=e=>{e.stopPropagation();saveSingleFeaturedBrand(id);};
  });
  renderBrandAdminCardImages();renderFeaturedBrandEditor();renderWorkerBrandPreview();
}
function renderBrandAdminCardImages(){document.querySelectorAll(".brand-admin-card").forEach(card=>{const b=state.featuredBrands.find(x=>String(x.id)===card.dataset.id);if(!b)return;const box=card.querySelector(".brand-card-image");box.innerHTML=b.imagen_url?`<img src="${escapeAttr(b.imagen_url)}" alt="">`:`<span>${escapeHtml(String(b.nombre||"M").slice(0,1).toUpperCase())}</span>`;});}
function renderFeaturedBrandEditor(){
  const b=getSelectedFeaturedBrand();if(!b){$("brandEditorTitle").textContent="Selecciona una marca";$("brandImageStage").innerHTML='<div class="brand-image-empty">🖼<span>Selecciona una marca</span></div>';return;}
  $("brandEditorTitle").textContent=b.nombre||"Nueva marca";$("brandNameInput").value=b.nombre||"";$("brandCategoryInput").value=b.categoria||"";$("brandImageUrlInput").value=(b.imagen_url||"").startsWith("data:")?"":(b.imagen_url||"");
  $("brandImageStage").innerHTML=b.imagen_url?`<img src="${escapeAttr(b.imagen_url)}" alt="${escapeAttr(b.nombre)}">`:'<div class="brand-image-empty">🖼<span>Sin imagen</span></div>';
  $("brandEditorStatus").textContent=b.imagen_url?"Imagen lista. Puedes quitar el fondo y guardar.":"Sube un logo o pega una URL.";
}
function handleFeaturedBrandImageFile(e){const file=e.target.files?.[0];if(!file)return;if(file.size>2*1024*1024){toast("La imagen supera los 2 MB.");e.target.value="";return;}if(!/^image\/(png|jpeg|webp)$/.test(file.type)){toast("Usa JPG, PNG o WEBP.");e.target.value="";return;}const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const maxW=700,maxH=350,scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight);const c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));c.getContext("2d").drawImage(img,0,0,c.width,c.height);const b=getSelectedFeaturedBrand();if(!b)return;b._dirty=true;b.imagen_url=c.toDataURL("image/png");renderFeaturedBrandEditor();renderBrandAdminCardImages();renderWorkerBrandPreview();};img.src=r.result;};r.readAsDataURL(file);e.target.value="";}
function transformFeaturedBrandImage(mode){const b=getSelectedFeaturedBrand();if(!b||!b.imagen_url)return toast("Primero selecciona una marca con imagen.");const img=new Image();img.onload=()=>{const w=img.naturalWidth,h=img.naturalHeight;const canvas=document.createElement("canvas");if(mode==="rotate"){canvas.width=h;canvas.height=w;const ctx=canvas.getContext("2d");ctx.translate(h/2,w/2);ctx.rotate(Math.PI/2);ctx.drawImage(img,-w/2,-h/2);}else{canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,w,h),d=data.data;const corners=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]].map(([x,y])=>{const i=(y*w+x)*4;return[d[i],d[i+1],d[i+2]]});const avg=corners.reduce((a,c)=>a.map((v,i)=>v+c[i]/corners.length),[0,0,0]);const tol=42,seen=new Uint8Array(w*h),q=[];const push=(x,y)=>{if(x<0||y<0||x>=w||y>=h)return;const k=y*w+x;if(seen[k])return;const i=k*4;if(Math.hypot(d[i]-avg[0],d[i+1]-avg[1],d[i+2]-avg[2])<=tol){seen[k]=1;q.push(k);}};for(let x=0;x<w;x++){push(x,0);push(x,h-1);}for(let y=0;y<h;y++){push(0,y);push(w-1,y);}for(let qi=0;qi<q.length;qi++){const k=q[qi],x=k%w,y=(k/w)|0,i=k*4;d[i+3]=0;push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);}ctx.putImageData(data,0,0);}b._dirty=true;b.imagen_url=canvas.toDataURL("image/png");renderFeaturedBrandEditor();renderBrandAdminCardImages();renderWorkerBrandPreview();toast(mode==="removebg"?"Fondo eliminado correctamente.":"Imagen girada.");};img.onerror=()=>toast("No se pudo editar la imagen. Sube el archivo desde tu PC para quitar el fondo.");img.crossOrigin="anonymous";img.src=b.imagen_url;}
function deleteSelectedFeaturedBrand(){const b=getSelectedFeaturedBrand();if(!b)return;if(!confirm(`¿Eliminar el aliado ${b.nombre}?`))return;if(b._new){state.featuredBrands=state.featuredBrands.filter(x=>String(x.id)!==String(b.id));}else{b._deleted=true;b._dirty=true;}state.selectedFeaturedBrandId=null;renderFeaturedBrandsAdmin();}
function allyWorkerCard(ally, duplicate=false){
  const src=String(ally?.logo_url||ally?.imagen_url||"").trim();
  const name=String(ally?.nombre||"Aliado");
  return `<button type="button" class="featured-brand-pill" data-ally-id="${escapeAttr(ally?.id??"")}" title="${escapeAttr(name)}">${src?`<img src="${escapeAttr(src)}" alt="Logo ${escapeAttr(name)}" loading="eager" decoding="async">`:`<span class="ally-logo-fallback">${escapeHtml(name.trim().slice(0,1).toUpperCase())}</span>`}<strong>${escapeHtml(name)}</strong></button>`;
}
function renderWorkerBrandPreview(){const track=$("workerBrandTrack");if(!track)return;const brands=[...state.featuredBrands].filter(b=>b.activo!==false).sort((a,b)=>Number(a.orden||0)-Number(b.orden||0)).slice(0,8);track.innerHTML=state.featuredBrandsEnabled&&brands.length?brands.map(b=>allyWorkerCard(b)).join("")+brands.map(b=>allyWorkerCard(b,true)).join(""):"<div class='worker-brand-disabled'>La sección está oculta para trabajadores.</div>";$("featuredBrandsEnabled").checked=state.featuredBrandsEnabled;}
async function saveSingleFeaturedBrand(id){
  const c=state.featuredBrands.find(x=>String(x.id)===String(id));
  if(!c) return;
  const btn=document.querySelector(`.brand-admin-card[data-id="${CSS.escape(String(id))}"] .ally-save-one`);
  if(btn){btn.disabled=true;btn.textContent="⏳ Guardando...";}
  try{
    if(CONFIG.demoMode){
      c._new=false;
      toast(`Aliado guardado: ${c.nombre}.`);
      renderFeaturedBrandsAdmin();
      return;
    }
    const payload={
      nombre:(c.nombre||"Nueva empresa").trim()||"Nueva empresa",
      logo_url:await persistAllyImage(c)||null,
      orden:Number(c.orden||1),
      activo:c.activo!==false
    };
    let row=null;
    const existing=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&limit=500");
    const norm=n=>normalizeBrandName(String(n||""));
    const old=existing.find(r=>norm(r.nombre)===norm(payload.nombre));
    if(old && Number(old.id)>0){
      const out=await supabaseUpdate("empresas_aliadas","id=eq."+encodeURIComponent(old.id),payload);
      row=Array.isArray(out)?out[0]:out;
      c.id=Number(old.id); c._dbId=Number(old.id);
    }else{
      const out=await supabaseInsert("empresas_aliadas",payload);
      row=Array.isArray(out)?out[0]:out;
      if(row?.id){c.id=Number(row.id);c._dbId=Number(row.id);}
    }
    if(!row && c._dbId){
      const check=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&id=eq."+encodeURIComponent(c._dbId)+"&limit=1");
      row=check[0];
    }
    if(!row || !(Number(row.id)>0)) throw new Error(`Supabase no confirmó la empresa "${payload.nombre}".`);
    // Guardar también las marcas relacionadas de ESTE aliado, sin tocar las demás.
    const names=[...new Set((c.marcas||COMPANY_ALIASES[c.nombre]||[]).map(x=>String(x).trim()).filter(Boolean))];
    const oldBrands=await supabaseGet("marcas","select=id,nombre,empresa_id&empresa_id=eq."+encodeURIComponent(Number(row.id)));
    const oldByName=new Map(oldBrands.map(b=>[norm(b.nombre),b]));
    for(const n of names){
      if(oldByName.has(norm(n))) continue;
      await supabaseInsert("marcas",{nombre:n,empresa_id:Number(row.id),logo_url:null,activo:true,orden:names.indexOf(n)+1});
    }
    const keep=new Set(names.map(norm));
    for(const b of oldBrands){if(!keep.has(norm(b.nombre))) await supabaseDelete("marcas","id=eq."+encodeURIComponent(b.id));}
    c._new=false;
    c._dirty=false;
    c.id=Number(row.id);c._dbId=Number(row.id);c.nombre=payload.nombre;c.imagen_url=payload.logo_url||"";c.orden=payload.orden;c.activo=payload.activo;
    renderFeaturedBrandsAdmin();
    renderBrandStrip();
    toast(`Guardado en Supabase: ${payload.nombre}.`);
  }catch(err){
    console.error("Error guardando aliado individual:",err);
    const msg=String(err?.message||err||"No se pudo guardar").replace(/\s+/g," ").slice(0,220);
    toast(`NO GUARDADO: ${msg}`);
  }finally{
    if(btn){btn.disabled=false;btn.textContent="▣ Guardar este aliado";}
  }
}

async function saveFeaturedBrands(){
  if(CONFIG.demoMode){
    renderFeaturedBrandsAdmin();
    toast("Aliados guardados en modo demostración.");
    return;
  }

  const changed=[...state.featuredBrands].filter(c=>c._dirty || c._new || c._deleted);
  if(!changed.length){
    toast("No hay cambios pendientes para guardar.");
    return;
  }

  const btn=$("saveBrandsBtn");
  if(btn){btn.disabled=true;btn.textContent="⏳ Guardando cambios...";}

  try{
    const existing=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&limit=500");
    const norm=n=>normalizeBrandName(String(n||""));
    const existingByName=new Map(existing.map(r=>[norm(r.nombre),r]));
    let savedCount=0, deletedCount=0, imageCount=0, relationCount=0;

    for(const c of changed){
      if(c._deleted){
        if(c._new) continue;
        const dbId=Number(c._dbId||c.id);
        if(dbId>0){
          await supabaseDelete("marcas","empresa_id=eq."+encodeURIComponent(dbId));
          await supabaseDelete("empresas_aliadas","id=eq."+encodeURIComponent(dbId));
        }
        c._deleted=false;
        deletedCount++;
        continue;
      }

      const payload={
        nombre:(c.nombre||"Nueva empresa").trim()||"Nueva empresa",
        logo_url:await persistAllyImage(c)||null,
        orden:Number(c.orden||1),
        activo:c.activo!==false
      };
      const old=existingByName.get(norm(payload.nombre));
      let row=null;
      if(old && Number(old.id)>0){
        const out=await supabaseUpdate("empresas_aliadas","id=eq."+encodeURIComponent(old.id),payload);
        row=Array.isArray(out)?out[0]:out;
        if(!row){
          const check=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&id=eq."+encodeURIComponent(old.id)+"&limit=1");
          row=check[0];
        }
      }else{
        const out=await supabaseInsert("empresas_aliadas",payload);
        row=Array.isArray(out)?out[0]:out;
      }
      if(!row || !(Number(row.id)>0)) throw new Error(`Supabase no confirmó la empresa "${payload.nombre}".`);
      if(String(row.logo_url||"")!==String(payload.logo_url||"")){
        const check=await supabaseGet("empresas_aliadas","select=id,nombre,logo_url,orden,activo&id=eq."+encodeURIComponent(row.id)+"&limit=1");
        row=check[0]||row;
      }
      if(String(row.logo_url||"")!==String(payload.logo_url||"")) throw new Error(`Supabase no confirmó la imagen de "${payload.nombre}".`);

      const names=[...new Set((c.marcas||COMPANY_ALIASES[c.nombre]||[]).map(x=>String(x).trim()).filter(Boolean))];
      const oldBrands=await supabaseGet("marcas","select=id,nombre,empresa_id&empresa_id=eq."+encodeURIComponent(Number(row.id)));
      const oldByName=new Map(oldBrands.map(b=>[norm(b.nombre),b]));
      for(let i=0;i<names.length;i++){
        const n=names[i];
        if(oldByName.has(norm(n))) continue;
        await supabaseInsert("marcas",{nombre:n,empresa_id:Number(row.id),logo_url:null,activo:true,orden:i+1});
        relationCount++;
      }
      const keep=new Set(names.map(norm));
      for(const b of oldBrands){if(!keep.has(norm(b.nombre))) await supabaseDelete("marcas","id=eq."+encodeURIComponent(b.id));}

      c._new=false;
      c._dbId=Number(row.id); c.id=Number(row.id);
      c.nombre=payload.nombre; c.imagen_url=payload.logo_url||""; c.orden=payload.orden; c.activo=payload.activo;
      c._dirty=false;
      savedCount++;
      if(payload.logo_url) imageCount++;
    }

    state.featuredBrands=state.featuredBrands.filter(c=>!c._deleted);
    renderFeaturedBrandsAdmin();
    renderBrandStrip();
    renderWorkerBrandPreview();
    toast(`Cambios guardados: ${savedCount} aliados, ${imageCount} imágenes${deletedCount?`, ${deletedCount} eliminados`:``}.`);
  }catch(err){
    console.error("Error guardando cambios de aliados:",err);
    const msg=String(err?.message||err||"No se pudo guardar").replace(/\s+/g," ").slice(0,280);
    toast(`NO GUARDADO: ${msg}`);
  }finally{
    if(btn){btn.disabled=false;btn.textContent="▣ Guardar cambios";}
  }
}

function categoryKey(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();}
function canonicalCategoryName(v){
  const key=categoryKey(v);
  // "Arro" is an accidental truncation of the real category "Arroz".
  // Treat both names as the same category everywhere in the UI.
  if(key==="arro" || key==="arroz") return "Arroz";
  return String(v||"").trim();
}
function sameCategory(a,b){return categoryKey(canonicalCategoryName(a))===categoryKey(canonicalCategoryName(b));}

function filteredProducts() {
  return state.products.filter(p => {
    const text = `${p.nombre||""} ${p.categoria||""}`.toLowerCase();
    const matchesText = !state.search || text.includes(state.search);
    const matchesCat = !state.selectedCategory || sameCategory(p.categoria, state.selectedCategory);
    const matchesBrand = !state.selectedBrand || String(p.nombre||"").toLowerCase().includes(state.selectedBrand.toLowerCase());
    const companyBrands = state.selectedCompany ? (COMPANY_ALIASES[state.selectedCompany] || state.featuredBrands.find(x=>x.nombre===state.selectedCompany)?.marcas || []) : [];
    const effectiveCompany = getEffectiveCompany(p);
    const directCompanyMatch = state.selectedCompany && normalizeBrandName(effectiveCompany) === normalizeBrandName(state.selectedCompany);
    const brandCompanyMatch = state.selectedCompany && companyBrands.some(b => normalizeBrandName(p.nombre).includes(normalizeBrandName(b)));
    const matchesCompany = !state.selectedCompany || directCompanyMatch || brandCompanyMatch;
    return matchesText && matchesCat && matchesBrand && matchesCompany;
  });
}

async function loadProductDetails(){
  state.productDetails = {};
  if (CONFIG.demoMode) {
    state.productDetails = {...RICE_DETAILS};
    return;
  }
  try {
    const rows = await supabaseGet("producto_detalles", "select=*&order=producto_id.asc");
    for (const r of rows || []) state.productDetails[String(r.producto_id)] = r;
  } catch (err) {
    // The catalog must keep working even before the optional details table is created.
    console.warn("No se pudo cargar producto_detalles. Puedes crear la tabla con producto_detalles.sql", err);
  }
}

const RICE_DETAILS = {
  "56": {tipo:"Extra Añejo",descripcion:"Es el más vendido para el diario. Granea excelente, aumenta bastante en la olla y el grano es suave.",agua:"1 taza de agua justa",caracteristicas:"Grano suave\nAlto rendimiento\nGranea excelente",recomendaciones:"Usar 1 taza de agua justa\nIdeal para consumo diario",tip:"Al guardarse para la noche se mantiene bien suavecito y rico, no se pone duro."},
  "57": {tipo:"Añejo Vaporizado",descripcion:"Es el más nutritivo. No se bate ni se pega porque los granos quedan bien separados de forma natural.",agua:"1 ¼ tazas de agua",caracteristicas:"Granos bien separados\nNo se bate\nNo se pega",recomendaciones:"Usar 1 ¼ tazas de agua\nIdeal para conservar entero",tip:"Aumenta un poco menos en volumen, pero para la noche se conserva entero y perfecto."},
  "58": {tipo:"Superior Añejo",descripcion:"Opción de calidad y precio intermedio. Cumple con un graneado normal y aumento estándar.",agua:"1 taza de agua justa",caracteristicas:"Calidad intermedia\nGraneado normal\nAumento estándar",recomendaciones:"Usar 1 taza de agua justa\nEntibiar antes de servir si se guardó",tip:"Si se guarda para la noche, se debe entibiar para recuperar su suavidad."},
  "50": {tipo:"Extra Añejo Económico",descripcion:"El más barato de la línea. Grano duro y resistente, ideal para saltear arroz chaufa.",agua:"1 taza de agua justa",caracteristicas:"Grano duro y resistente\nEconómico\nIdeal para chaufa",recomendaciones:"Usar 1 taza de agua justa\nIdeal para arroz chaufa",tip:"Rinde menos y si sobra para la noche se pone durito."},
  "59": {tipo:"Extra Añejo Premium",descripcion:"Arroz de gran categoría y grano súper seleccionado. Como es bien añejo, el grano está más seco y sediento.",agua:"1 ⅛ tazas de agua (1 taza + 2 cucharadas)",caracteristicas:"Grano súper seleccionado\nAlto rendimiento\nGranea espectacular",recomendaciones:"Usar 1 ⅛ tazas de agua\nCocinar con la medida indicada",tip:"Aumenta un montón y para la noche queda súper suave."},
  "55": {tipo:"Extra / Semiañejo",descripcion:"El clásico norteño de grano muy blanco. Al ser semiañejo retiene algo de humedad propia.",agua:"1 taza de agua al ras (o un dedito menos)",caracteristicas:"Grano muy blanco\nGraneado parejo\nTextura agradable",recomendaciones:"Usar 1 taza de agua al ras\nEvitar exceso de agua",tip:"Al guardarse para la noche se mantiene suave y agradable."},
  "54": {tipo:"Añejo Rendidor",descripcion:"Arroz norteño de grano consistente, muy rendidor para el menú diario.",agua:"1 taza de agua justa",caracteristicas:"Grano consistente\nRendidor\nGranea suelto",recomendaciones:"Usar 1 taza de agua justa\nIdeal para menú diario",tip:"Aguanta los recalentados sin romperse."},
  "51": {tipo:"Extra",descripcion:"Arroz comercial de gran calidad con granos bien seleccionados.",agua:"1 taza de agua justa",caracteristicas:"Granos bien seleccionados\nBuena calidad\nGranea fácil",recomendaciones:"Usar 1 taza de agua justa\nIdeal para menú familiar",tip:"Guardado para la noche se mantiene bastante suave."},
  "52": {tipo:"NIR / Familiar",descripcion:"La variedad rendidora de la marca, enfocada en dar volumen. Su grano es naturalmente más seco.",agua:"1 taza de agua justa",caracteristicas:"Rendidor\nGrano más seco\nBuen volumen",recomendaciones:"Usar 1 taza de agua justa\nIdeal para consumo familiar",tip:"Rinde mucho en la olla, pero si sobra para la noche tiende a secarse un poco."},
  "53": {tipo:"NIR / Económico",descripcion:"Opción de bajo costo muy buscada para menús comerciales masivos. Su fuerte es el rendimiento en volumen bruto.",agua:"1 taza de agua al ras",caracteristicas:"Económico\nRendimiento en volumen\nGrano seco",recomendaciones:"Usar 1 taza de agua al ras\nIdeal para menús comerciales",tip:"Granea por ser seco y si se guarda para la noche se pone firme."}
};
function productDetailData(p){
  const id=String(p?.id);
  const fallback=RICE_DETAILS[id] || {tipo:"",descripcion:"",agua:"",caracteristicas:"",recomendaciones:"",tip:""};
  return {...fallback,...(state.productDetails[id] || {})};
}

function renderCatalog() {
  const list = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.catalogPage > totalPages) state.catalogPage = totalPages;
  const start = (state.catalogPage - 1) * state.pageSize;
  const visible = list.slice(start, start + state.pageSize);
  $("stats").innerHTML = `
    <div class="stat"><div class="stat-label">Productos</div><div class="stat-value">${state.products.length}</div></div>
    <div class="stat"><div class="stat-label">Categorías</div><div class="stat-value">${new Set(state.products.map(p=>p.categoria).filter(Boolean)).size}</div></div>
    <div class="stat"><div class="stat-label">Mostrando</div><div class="stat-value">${list.length}</div></div>`;
  $("productGrid").classList.toggle("rice-catalog-grid", visible.length > 0 && visible.every(p => sameCategory(p.categoria, "Arroz")));
  $("productGrid").innerHTML = visible.map(productCard).join("");
  $("productGrid").querySelectorAll(".view-more-btn").forEach(btn => btn.addEventListener("click", () => openProductDetail(btn.dataset.productId)));
  $("productGrid").querySelectorAll(".edit-product-btn").forEach(btn => btn.addEventListener("click", () => { const p=state.products.find(x=>Number(x.id)===Number(btn.dataset.productId)); openProductEditorByCategory(btn.dataset.productId); }));
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

function getDetailPresentations(p) {
  const existing = Array.isArray(p?.precios_mayor) ? p.precios_mayor.filter(x => x && String(x.Presentacion || "").trim()) : [];
  return existing;
}
function isSpecialMarketPublicProduct(p) {
  // ÚNICAMENTE estas dos categorías usan el editor/detalle especial.
  // Todo lo demás debe seguir entrando al editor normal existente.
  const cat = normalizeBrandName(String(p?.categoria || ""));
  return cat === "arroz" || cat === "azucar";
}

function openProductEditorByCategory(id) {
  const p = state.products.find(x => Number(x.id) === Number(id));
  if (!p) return;
  if (isSpecialMarketPublicProduct(p)) return openProductTextEditor(id);
  return openProductModal(id);
}
function isLargeRicePresentation(label, p=null) {
  if (p && !isSpecialMarketPublicProduct(p)) return false;
  const t = normalizeBrandName(String(label || ""));
  const kg = t.match(/(\d+(?:[.,]\d+)?)\s*kg/);
  if (!kg) return /saco|bulto/i.test(t);
  const n = Number(String(kg[1]).replace(',','.'));
  return n === 49 || n === 50;
}

function riceTypeClass(tipo) {
  const t = normalizeBrandName(String(tipo || ""));
  if (t.includes("extra anejo premium")) return "premium";
  if (t.includes("extra anejo economico")) return "economico";
  if (t.includes("superior anejo")) return "superior";
  if (t.includes("anejo vaporizado")) return "vaporizado";
  if (t.includes("extra anejo")) return "extra-anejo";
  if (t.includes("nir")) return "nir";
  if (t.includes("extra / semian")) return "extra-semi";
  if (t === "extra" || t.startsWith("extra ")) return "extra";
  if (t.includes("anejo rendidor")) return "rendidor";
  return "default";
}
function riceMiniInfo(p) {
  if (!sameCategory(p?.categoria, "Arroz")) return "";
  const d = productDetailData(p);
  if (!d.tipo && !d.descripcion && !d.agua) return "";
  const short = String(d.descripcion || "").replace(/\s+/g," ").trim();
  const shortText = short.length > 92 ? short.slice(0,89).trimEnd()+"…" : short;
  const pres = getDetailPresentations(p);
  const typeClass = riceTypeClass(d.tipo);
  return `<div class="rice-mini-info">
    ${d.tipo ? `<div class="rice-mini-type ${typeClass}">${escapeHtml(d.tipo)}</div>` : ""}
    ${shortText ? `<div class="rice-mini-description">${escapeHtml(shortText)}</div>` : ""}
    ${pres.length ? `<div class="rice-mini-pres"><span class="rice-mini-pres-icon">▱</span><span><b>Presentaciones:</b> ${escapeHtml(pres.map(x=>x.Presentacion).join(" · "))}</span></div>` : ""}
  </div>`;
}
function productCard(p) {
  const isRice = sameCategory(p?.categoria, "Arroz");
  const prices = priceRows(p);
  const img = p.imagen_url ? `<img src="${escapeAttr(p.imagen_url)}" alt="${escapeAttr(p.nombre||"Producto")}" onerror="this.style.display='none';this.parentElement.querySelector('.no-image').style.display='block'">` : "";
  const editBtn = isAdmin() ? `<button type="button" class="edit-product-btn" data-product-id="${Number(p.id)}">✎ <span>Editar</span></button>` : "";
  if (isRice) return `<article class="product-card rice-product-card">
    <div class="product-image rice-product-image">${img}<div class="rice-favorite" aria-hidden="true">♡</div><div class="no-image" style="${p.imagen_url?'display:none':''}">▧</div></div>
    <div class="product-body rice-product-body">
      <div class="product-category">${escapeHtml(p.categoria || "Arroz")}</div>
      <div class="product-name">${escapeHtml(p.nombre || "Producto sin nombre")}</div>
      ${riceMiniInfo(p)}
      <div class="product-card-actions"><button type="button" class="view-more-btn" data-product-id="${Number(p.id)}">◉ <span>Ver más</span></button>${editBtn}</div>
    </div>
  </article>`;
  return `<article class="product-card">
    <div class="product-image">${img}<div class="no-image" style="${p.imagen_url?'display:none':''}">▧</div></div>
    <div class="product-body">
      <div class="product-category">${escapeHtml(p.categoria || "Sin categoría")}</div>
      <div class="product-name">${escapeHtml(p.nombre || "Producto sin nombre")}</div>
      <div class="price-list">${prices}</div>
      <div class="product-card-actions"><button type="button" class="view-more-btn" data-product-id="${Number(p.id)}">◉ Ver más</button>${editBtn}</div>
    </div>
  </article>`;
}

function openProductDetail(id) {
  const p = state.products.find(x => Number(x.id) === Number(id));
  if (!p) return;
  const d = productDetailData(p);
  $("detailTitle").textContent = p.nombre || "Producto";
  $("detailCategory").textContent = p.categoria || "Sin categoría";
  $("detailType").textContent = d.tipo || "";
  $("detailType").className = "detail-type " + riceTypeClass(d.tipo);
  $("detailDescription").textContent = d.descripcion || "";
  $("detailWater").textContent = d.agua || "";
  $("detailCharacteristics").innerHTML = listHtml(d.caracteristicas);
  $("detailRecommendations").innerHTML = listHtml(d.recomendaciones);
  $("detailTip").textContent = d.tip || "";
  const img = $("detailImage"), empty=$("detailImageEmpty");
  if (p.imagen_url) { img.src=p.imagen_url; img.style.display="block"; empty.style.display="none"; img.onerror=()=>{img.style.display="none";empty.style.display="flex";}; }
  else { img.removeAttribute("src"); img.style.display="none"; empty.style.display="flex"; }

  const presentations = getDetailPresentations(p);
  const wrap=$("detailPresentations");
  if (presentations.length) {
    const renderSelected = (item) => {
      const hasDual = isSpecialMarketPublicProduct(p) && isLargeRicePresentation(item.Presentacion, p) && (item.PrecioMercado !== null || item.PrecioPublico !== null || p.precio_mercado !== null || p.precio_publico !== null);
      if (hasDual) {
        const market = item.PrecioMercado !== null ? item.PrecioMercado : p.precio_mercado;
        const publico = item.PrecioPublico !== null ? item.PrecioPublico : p.precio_publico;
        return `<div class="detail-selected-price detail-selected-dual"><div><span>Mercado</span><strong>${market===null?"Precio no configurado":"S/ "+money(market)}</strong></div><div><span>Público</span><strong>${publico===null?"Precio no configurado":"S/ "+money(publico)}</strong></div></div>`;
      }
      return `<div class="detail-selected-price"><span>Precio</span><strong>${item.Precio===null?"Precio no configurado":"S/ "+money(item.Precio)}</strong></div>`;
    };
    wrap.innerHTML = `<h4>Selecciona una presentación</h4><div class="detail-presentation-buttons">${presentations.map((x,i)=>`<button type="button" class="detail-pres-btn ${i===0?'active':''}" data-index="${i}">${escapeHtml(x.Presentacion)}</button>`).join("")}</div><div id="detailSelectedPriceWrap">${renderSelected(presentations[0])}</div>`;
    wrap.querySelectorAll(".detail-pres-btn").forEach(btn=>btn.onclick=()=>{
      wrap.querySelectorAll(".detail-pres-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      $("detailSelectedPriceWrap").innerHTML=renderSelected(presentations[Number(btn.dataset.index)]);
    });
  } else {
    wrap.innerHTML=`<div class="detail-empty-price">Sin presentaciones registradas</div>`;
  }
  const edit=$("detailEditBtn");
  edit.dataset.id=String(p.id); edit.style.display=isAdmin()?"inline-flex":"none";
  $("productDetailModal").classList.remove("hidden");
}

function listHtml(value){
  const arr=String(value||"").split(/\r?\n|•|;/).map(x=>x.trim()).filter(Boolean);
  return arr.length ? arr.map(x=>`<div class="detail-list-item">✓ ${escapeHtml(x)}</div>`).join("") : `<div class="detail-muted">Sin información registrada</div>`;
}

function ricePresentationKey(label) {
  const raw = String(label || "").trim().toLowerCase().replace(/,/g,".").replace(/\s+/g," ");
  if (/^(?:3\/4|0\.?75|750)\s*(?:kg|g)$/.test(raw) || raw === "3/4 kg") return "3/4 kg";
  const m = raw.match(/(\d+(?:\.\d+)?)\s*kg/);
  if (m) {
    const n=Number(m[1]);
    if ([1,5,10,25,49,50].includes(n)) return `${n} kg`;
  }
  const g=raw.match(/(\d+(?:\.\d+)?)\s*g/);
  if(g && Number(g[1])===750) return "3/4 kg";
  return "";
}
const RICE_PRESENTATION_OPTIONS=["3/4 kg","1 kg","5 kg","10 kg","25 kg","49 kg","50 kg"];
function ricePresentationSelect(selected="") {
  const key=ricePresentationKey(selected);
  return `<select class="detail-editor-pres-name" aria-label="Presentación">${RICE_PRESENTATION_OPTIONS.map(opt=>`<option value="${escapeAttr(opt)}" ${opt===key?"selected":""}>${escapeHtml(opt)}</option>`).join("")}</select>`;
}
function renderDetailEditorPresentations(pres,p) {
  const wrap=$("detailEditorPresentations"); if(!wrap)return;
  const special=isSpecialMarketPublicProduct(p);
  const source=Array.isArray(pres)?pres:[];
  wrap.innerHTML=source.map((x,i)=>{
    const name=special?(ricePresentationKey(x?.Presentacion)||RICE_PRESENTATION_OPTIONS[0]):String(x?.Presentacion||"").trim();
    const large=special && isLargeRicePresentation(name,p);
    const market=large?(x.PrecioMercado ?? p?.precio_mercado ?? null):null;
    const publico=large?(x.PrecioPublico ?? p?.precio_publico ?? null):null;
    return `<div class="detail-editor-pres-row ${large?'is-large':''}" data-index="${i}">${special?ricePresentationSelect(name):`<input class="detail-editor-pres-name" type="text" value="${escapeAttr(name)}" placeholder="Presentación">`}<input class="detail-editor-pres-price" type="number" min="0" step="0.01" value="${x.Precio ?? ""}" placeholder="Precio">${special?`<input class="detail-editor-pres-market" type="number" min="0" step="0.01" value="${market ?? ""}" placeholder="Mercado" ${large?"":"disabled"}><input class="detail-editor-pres-public" type="number" min="0" step="0.01" value="${publico ?? ""}" placeholder="Público" ${large?"":"disabled"}>`:''}<button type="button" class="detail-editor-pres-remove" title="Eliminar presentación">🗑️</button></div>`;
  }).join("");
  wrap.querySelectorAll('.detail-editor-pres-row').forEach(row=>{
    const update=()=>{
      if(!special)return;
      const name=row.querySelector('.detail-editor-pres-name')?.value||'';
      const large=isLargeRicePresentation(name,p);
      row.classList.toggle('is-large',large);
      const market=row.querySelector('.detail-editor-pres-market'), pub=row.querySelector('.detail-editor-pres-public');
      if(market){market.disabled=!large;if(!large)market.value='';}
      if(pub){pub.disabled=!large;if(!large)pub.value='';}
    };
    row.querySelector('.detail-editor-pres-name')?.addEventListener('change',update);
    row.querySelector('.detail-editor-pres-remove')?.addEventListener('click',()=>row.remove());
    update();
  });
}
function readDetailEditorPresentations(p=null) {
  const special=isSpecialMarketPublicProduct(p);
  return [...document.querySelectorAll('#detailEditorPresentations .detail-editor-pres-row')].map(row=>{
    const raw=row.querySelector('.detail-editor-pres-name')?.value||'';
    const name=special?(ricePresentationKey(raw)||raw.trim()):raw.trim();
    const price=numberOrNull(row.querySelector('.detail-editor-pres-price')?.value);
    const market=special&&isLargeRicePresentation(name,p)?numberOrNull(row.querySelector('.detail-editor-pres-market')?.value):null;
    const publico=special&&isLargeRicePresentation(name,p)?numberOrNull(row.querySelector('.detail-editor-pres-public')?.value):null;
    return {Presentacion:name,Precio:price,PrecioMercado:market,PrecioPublico:publico};
  }).filter(x=>x.Presentacion);
}
function addDetailEditorPresentation() {
  const wrap=$("detailEditorPresentations"); if(!wrap)return;
  const p=state.products.find(x=>Number(x.id)===Number($("detailEditorProductId")?.value));
  const special=isSpecialMarketPublicProduct(p);
  const row=document.createElement('div'); row.className='detail-editor-pres-row';
  row.innerHTML=`${special?ricePresentationSelect('3/4 kg'):'<input class="detail-editor-pres-name" type="text" placeholder="Presentación">'}<input class="detail-editor-pres-price" type="number" min="0" step="0.01" placeholder="Precio">${special?'<input class="detail-editor-pres-market" type="number" min="0" step="0.01" placeholder="Mercado" disabled><input class="detail-editor-pres-public" type="number" min="0" step="0.01" placeholder="Público" disabled>':''}<button type="button" class="detail-editor-pres-remove" title="Eliminar presentación">🗑️</button>`;
  const update=()=>{
    if(!special)return;
    const large=isLargeRicePresentation(row.querySelector('.detail-editor-pres-name')?.value||'',p);
    row.classList.toggle('is-large',large);
    const market=row.querySelector('.detail-editor-pres-market'),pub=row.querySelector('.detail-editor-pres-public');
    if(market){market.disabled=!large;if(!large)market.value='';}
    if(pub){pub.disabled=!large;if(!large)pub.value='';}
  };
  row.querySelector('.detail-editor-pres-name')?.addEventListener('change',update);
  row.querySelector('.detail-editor-pres-remove').onclick=()=>row.remove();
  wrap.appendChild(row); update();
}
function openProductTextEditor(id){
  if(!isAdmin()) return toast('Solo un administrador puede editar esta información.');
  const p=state.products.find(x=>Number(x.id)===Number(id)); if(!p)return;
  if(!isSpecialMarketPublicProduct(p)) return openProductModal(id);
  const d=productDetailData(p);
  $("detailEditorProductId").value=String(p.id);
  $("detailEditorName").textContent=p.nombre||'Producto';
  const cloneName=$("detailEditorNameClone"); if(cloneName) cloneName.textContent=p.nombre||'Producto';
  $("detailEditorCategory").textContent=(p.categoria||'').toUpperCase();
  $("detailEditorImage").src=p.imagen_url||'';
  $("detailEditorImage").style.display=p.imagen_url?'block':'none';
  $("detailEditorImageEmpty").style.display=p.imagen_url?'none':'flex';
  $("detailEditorType").value=d.tipo||'';
  const typeBadge=$("specialEditorTypeBadge"); if(typeBadge){ typeBadge.textContent=d.tipo||''; typeBadge.className="special-type-badge "+riceTypeClass(d.tipo); }
  $("detailEditorType").oninput=()=>{ if(typeBadge){typeBadge.textContent=$("detailEditorType").value; typeBadge.className="special-type-badge "+riceTypeClass($("detailEditorType").value);} };
  $("detailEditorDescription").value=d.descripcion||'';
  $("detailEditorWater").value=d.agua||'';
  $("detailEditorCharacteristics").value=d.caracteristicas||'';
  $("detailEditorRecommendations").value=d.recomendaciones||'';
  $("detailEditorTip").value=d.tip||'';
  renderDetailEditorPresentations(getDetailPresentations(p),p);
  $("textEditorModal").classList.remove('hidden');
}

function closeTextEditor(){ $("textEditorModal").classList.add("hidden"); }
async function saveProductTextDetails(){
  if(!isAdmin()) return;
  const id=$("detailEditorProductId").value;
  const payload={producto_id:Number(id),tipo:$("detailEditorType").value.trim(),descripcion:$("detailEditorDescription").value.trim(),agua:$("detailEditorWater").value.trim(),caracteristicas:$("detailEditorCharacteristics").value.trim(),recomendaciones:$("detailEditorRecommendations").value.trim(),tip:$("detailEditorTip").value.trim(),fecha_actualizacion:new Date().toISOString()};
  const currentProduct=state.products.find(x=>Number(x.id)===Number(id)) || null;
  const presentations=readDetailEditorPresentations(currentProduct);
  const largeRow=presentations.find(x=>isLargeRicePresentation(x.Presentacion,currentProduct) && (x.PrecioMercado!==null || x.PrecioPublico!==null));
  try{
    if(CONFIG.demoMode){state.productDetails[id]=payload;}
    else {
      await supabaseRequest("producto_detalles?on_conflict=producto_id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=representation"},body:JSON.stringify(payload)});
      const productUpdate={precios_mayor:presentations};
      if(largeRow){ productUpdate.precio_mercado=largeRow.PrecioMercado; productUpdate.precio_publico=largeRow.PrecioPublico; }
      await supabaseUpdate("productos","id=eq."+encodeURIComponent(id),productUpdate);
    }
    state.productDetails[id]=payload;
    const p=state.products.find(x=>Number(x.id)===Number(id));
    if(p){ p.precios_mayor=presentations; if(largeRow){p.precio_mercado=largeRow.PrecioMercado;p.precio_publico=largeRow.PrecioPublico;} }
    closeTextEditor(); renderCatalog(); openProductDetail(id); toast("Información, presentaciones y precios guardados correctamente.");
  }catch(err){console.error(err);toast("No se pudo guardar. Verifica que producto_detalles.sql esté creado y que el usuario tenga permiso para actualizar productos.");}
}

function closeProductDetail(){ $("productDetailModal").classList.add("hidden"); }

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

function buildAdminProductCategoryFilter() {
  const el = $("adminProductCategory");
  if (!el) return;
  const cats = getCategoryNames();
  el.innerHTML = `<option value="">Todas las categorías</option>` + cats.map(c => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  el.value = state.adminProductCategory || "";
}
function populateProductCategorySelect(){
  const el=$("pCategoria");
  if(!el) return;
  const current=String(el.value||"").trim();
  const cats=getCategoryNames();
  el.innerHTML=`<option value="">Selecciona una categoría</option>`+
    cats.map(c=>`<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("");
  if(current && !cats.some(c=>c.toLowerCase()===current.toLowerCase())){
    el.insertAdjacentHTML("beforeend",`<option value="${escapeAttr(current)}">${escapeHtml(current)}</option>`);
  }
  el.value=current;
}

function getAdminFilteredProducts() {
  const q = String(state.adminProductSearch || "").trim().toLowerCase();
  const cat = String(state.adminProductCategory || "").trim();
  return state.products.filter(p => {
    const company = getEffectiveCompany(p);
    const haystack = `${p.nombre || ""} ${p.marca || ""} ${company} ${p.categoria || ""}`.toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    const matchesCategory = !cat || String(p.categoria || "") === cat;
    return matchesSearch && matchesCategory;
  });
}

function renderProductTable() {
  if (!isAdmin()) return;
  const filtered = getAdminFilteredProducts();
  $("productTableBody").innerHTML = filtered.map(p => `<tr>
    <td><input class="product-check" type="checkbox" value="${Number(p.id)}"></td>
    <td>${p.imagen_url ? `<img class="table-product-img" src="${escapeAttr(p.imagen_url)}" alt="" onerror="this.style.display='none'">` : `<span class="table-product-placeholder">▧</span>`}</td>
    <td><strong>${escapeHtml(p.nombre||"")}</strong></td>
    <td>${escapeHtml(p.categoria||"")}</td>
    <td>${moneyCell(p.precio_unidad)}</td>
    <td>${p.precios_mayor?.length ? `<div class="presentation-list">${p.precios_mayor.map(x=>`<span class="presentation-chip">${escapeHtml(x.Presentacion)}: S/ ${money(x.Precio)}</span>`).join("")}</div>` : "—"}</td>
    <td>${moneyCell(p.precio_mercado)}</td>
    <td>${moneyCell(p.precio_publico)}</td>
    <td><div class="actions"><button class="small-btn" onclick="${isSpecialMarketPublicProduct(p) ? `openProductTextEditor(${Number(p.id)})` : `openProductModal(${Number(p.id)})`}">Editar</button><button class="small-btn danger" onclick="deleteProduct(${Number(p.id)})">Eliminar</button></div></td>
  </tr>`).join("");
  document.querySelectorAll(".product-check").forEach(c => c.onchange = updateSelectedCount);
  $("selectAllProducts").checked = false;
  updateSelectedCount();
  const count = $("adminProductResultCount");
  if (count) count.textContent = `${filtered.length} de ${state.products.length} productos`;
}
function getSelectedProductIds(){ return [...document.querySelectorAll(".product-check:checked")].map(x=>Number(x.value)); }
function updateSelectedCount(){ const ids=getSelectedProductIds(); $("selectedCount").textContent=`${ids.length} seleccionado${ids.length===1?"":"s"}`; $("editSelectedBtn").textContent=`✎ EDITAR (${ids.length})`; $("deleteSelectedBtn").textContent=`▣ ELIMINAR (${ids.length})`; const all=document.querySelectorAll(".product-check"); $("selectAllProducts").checked=all.length>0&&ids.length===all.length; }
function setAllProductChecks(checked){ document.querySelectorAll(".product-check").forEach(c=>c.checked=checked); $("selectAllProducts").checked=checked; updateSelectedCount(); }
function editSelectedProduct(){
  const ids=getSelectedProductIds();
  if(ids.length!==1) return toast("Selecciona exactamente un producto para editarlo.");
  const p=state.products.find(x=>Number(x.id)===Number(ids[0]));
  openProductEditorByCategory(ids[0]);
}
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
  populateProductCategorySelect();
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

/* Selector inteligente de imágenes: el usuario configura la carpeta raíz una sola vez.
   Chrome/Edge modernos permiten recordar el directorio y abrir cada selector en su carpeta.
   En navegadores sin File System Access API se conserva el selector normal como respaldo. */
const IMAGE_PICKER_DB = "sistemaPreciosImagenes";
const IMAGE_PICKER_STORE = "handles";
let imageRootHandle = null;
let imageLogoHandle = null;

function imagePickerDB(){
  return new Promise((resolve,reject)=>{
    if(!window.indexedDB) return resolve(null);
    const req=indexedDB.open(IMAGE_PICKER_DB,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(IMAGE_PICKER_STORE);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function saveImageRootHandle(handle){
  try{const db=await imagePickerDB();if(!db)return;await new Promise((res,rej)=>{const tx=db.transaction(IMAGE_PICKER_STORE,"readwrite");tx.objectStore(IMAGE_PICKER_STORE).put(handle,"root");tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});}catch(e){console.warn("No se pudo recordar la carpeta de imágenes",e);}
}
async function loadImageRootHandle(){
  try{const db=await imagePickerDB();if(!db)return null;return await new Promise((res,rej)=>{const tx=db.transaction(IMAGE_PICKER_STORE,"readonly");const r=tx.objectStore(IMAGE_PICKER_STORE).get("root");r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error);});}catch(e){return null;}
}
async function ensureDirectoryPermission(handle){
  if(!handle) return false;
  try{
    if(handle.queryPermission && await handle.queryPermission({mode:"read"}) === "granted") return true;
    if(handle.requestPermission) return (await handle.requestPermission({mode:"read"})) === "granted";
  }catch(e){console.warn("Permiso de carpeta no concedido",e);}
  return false;
}
async function configureImageFolder(){
  if(!window.showDirectoryPicker){
    toast("Tu navegador no permite recordar una carpeta. Usa Chrome o Edge en PC para activar el selector inteligente.");
    return;
  }
  try{
    const handle=await window.showDirectoryPicker({mode:"read",id:"sistema-precios-imagenes"});
    if(!(await ensureDirectoryPermission(handle))) return toast("No se concedió permiso para leer la carpeta.");
    imageRootHandle=handle;
    // Guardamos también la carpeta exacta de logos para que "Editar logo" abra allí directamente.
    imageLogoHandle=await getSubdir(handle,["00_LOGOS_TODOS"]) || await getSubdir(handle,["00_LOGOS"]);
    await saveImageRootHandle(handle);
    try{const db=await imagePickerDB();if(db && imageLogoHandle){await new Promise((res,rej)=>{const tx=db.transaction(IMAGE_PICKER_STORE,"readwrite");tx.objectStore(IMAGE_PICKER_STORE).put(imageLogoHandle,"logo");tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});}}catch(e){}
    updateImageFolderStatus();
    toast(`Carpeta configurada: ${handle.name}. Desde ahora los selectores abrirán allí.`);
  }catch(e){if(e?.name!=="AbortError") toast("No se pudo configurar la carpeta de imágenes.");}
}
async function initImageFolder(){
  imageRootHandle=await loadImageRootHandle();
  if(imageRootHandle && !(await ensureDirectoryPermission(imageRootHandle))) imageRootHandle=null;
  if(imageRootHandle){
    try{
      const db=await imagePickerDB();
      if(db){imageLogoHandle=await new Promise((res,rej)=>{const tx=db.transaction(IMAGE_PICKER_STORE,"readonly");const r=tx.objectStore(IMAGE_PICKER_STORE).get("logo");r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error);});}
    }catch(e){imageLogoHandle=null;}
    if(!imageLogoHandle) imageLogoHandle=await getSubdir(imageRootHandle,["00_LOGOS_TODOS"]) || await getSubdir(imageRootHandle,["00_LOGOS"]);
    if(imageLogoHandle && !(await ensureDirectoryPermission(imageLogoHandle))) imageLogoHandle=null;
  }
  updateImageFolderStatus();
}
function updateImageFolderStatus(){const el=$("imageFolderStatus");if(el)el.textContent=imageRootHandle?`Carpeta: ${imageRootHandle.name}`:"No configurada";}
async function getSubdir(root,names){
  let h=root;
  for(const name of names){if(!name)continue;try{h=await h.getDirectoryHandle(name,{create:false});}catch(e){return null;}}
  return h;
}
function safeName(s){
  return String(s||"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/[^A-Za-z0-9._ -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function uploadImageDataUrl(bucket, folder, baseName, dataUrl){
  if(!dataUrl || !String(dataUrl).startsWith("data:image/")) return dataUrl || "";
  if(!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) throw new Error("Configura Supabase antes de subir imágenes.");
  const m=String(dataUrl).match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/i);
  if(!m) throw new Error("Formato de imagen no compatible para Storage.");
  const mime=m[1].toLowerCase();
  const bytes=Uint8Array.from(atob(m[2]),c=>c.charCodeAt(0));
  const blob=new Blob([bytes],{type:mime});
  if(blob.size>5*1024*1024) throw new Error("La imagen supera los 5 MB.");
  const ext=mime==='image/jpeg'?'jpg':mime==='image/webp'?'webp':'png';
  const cleanBase=safeName(baseName||"imagen").replace(/\s+/g,"_").replace(/[^A-Za-z0-9._-]/g,"_").replace(/_+/g,"_").replace(/^_+|_+$/g,"")||"imagen";
  const parts=String(folder||"").split("/").filter(Boolean).map(x=>encodeURIComponent(safeName(x)));
  const path=[...parts,`${cleanBase}.${ext}`].join("/");
  // Storage object keys are normalized to plain ASCII to avoid InvalidKey errors (e.g. Faraón -> Faraon).
  const res=await fetch(`${CONFIG.supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`,{
    method:"POST",
    headers:{"apikey":CONFIG.supabaseAnonKey,"Authorization":`Bearer ${CONFIG.supabaseAnonKey}`,"Content-Type":mime,"x-upsert":"true"},
    body:blob
  });
  if(!res.ok) throw new Error(`Storage ${res.status}: ${await res.text()}`);
  return `${CONFIG.supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path}`;
}
async function persistAllyImage(c){
  const src=String(c?.imagen_url||"").trim();
  if(!src || !src.startsWith("data:image/")) return src;
  const url=await uploadImageDataUrl("imagenes","logos",String(c?.nombre||"empresa"),src);
  c.imagen_url=url; return url;
}
async function persistProductImage(product){
  const src=String(product?.imagen_url||"").trim();
  if(!src || !src.startsWith("data:image/")) return src;
  const company=getEffectiveCompany(product);
  const companyDir=IMAGE_COMPANY_DIR[company] || safeName(company) || "SIN_EMPRESA";
  const brand=safeName(getEffectiveBrandForProduct(product)) || "SIN_MARCA";
  const url=await uploadImageDataUrl("imagenes-productos",`productos/${companyDir}/${brand}`,String(product?.nombre||"producto"),src);
  product.imagen_url=url; return url;
}
const IMAGE_COMPANY_DIR={"Nestlé":"01_NESTLE","Alicorp":"02_ALICORP","Rinti S.A.":"03_RINTI","Molitalia S.A.":"04_MOLITALIA","Procter & Gamble":"05_PROCTER_GAMBLE","Altomayo Perú S.A.C.":"06_ALTOMAYO_PERHUSA","Romex":"07_ROMEX","Sibarita":"08_SIBARITA","Lopesa Industrial S.A.":"09_LOPESA_INDUSTRIAL","Molino Don Julio S.A.C.":"10_MOLINO_DON_JULIO","Molino San Francisco S.A.C.":"11_MOLINO_SAN_FRANCISCO","Inversiones Rubio S.A.C.":"12_INVERSIONES_RUBIO","Molino Chiclayo":"13_MOLINO_CHICLAYO","Molino Samán S.R.L.":"14_MOLINO_SAMAN","Productos Faraón S.A.C.":"15_PRODUCTOS_FARAON","Complejo Agroindustrial Cartavio S.A.A.":"16_CARTAVIO","Casa Grande S.A.A.":"17_CASA_GRANDE","Zunda América S.A.C.":"26_ZUNDA_AMERICA","Agroindustrias Integradas S.A.":"18_AGROINDUSTRIAS_INTEGRADAS","Agroindustrias Oleaginosas del Perú S.A.":"19_AGROINDUSTRIAS_OLEAGINOSAS_PERU","Industrias Alpamayo S.A.":"20_INDUSTRIAS_ALPAMAYO","Industrias del Espino S.A.":"21_INDUSTRIAS_DEL_ESPINO","Industria Peruana de Aceites y Grasas S.R.L.":"22_INDUSTRIA_PERUANA_ACEITES_GRASAS","Productos Industriales R & R S.A.C.":"23_PRODUCTOS_INDUSTRIALES_RR","Alimentos Cielo":"24_ALIMENTOS_CIELO","Anita Foods":"25_ANITA_FOODS","Agroindustria Santa María S.A.C.":"27_AGROINDUSTRIA_SANTA_MARIA"};
function getEffectiveBrandForProduct(p){
  const direct=String(p?.marca||"").trim(); if(direct)return direct;
  const n=normalizeBrandName(String(p?.nombre||""));
  const company=getEffectiveCompany(p);
  const brands=COMPANY_ALIASES[company]||[];
  const hit=brands.find(b=>n.includes(normalizeBrandName(b)) || normalizeBrandName(b).includes(n));
  if(hit)return hit;
  if(n.includes("mimascot") || n.includes("mimaskot")) return "Mimaskot";
  return "";
}
async function pickImageSmart(kind){
  const input = kind==="logo" ? $("brandImageFile") : $("pImageFile");
  if(!input)return;
  if(!window.showOpenFilePicker || !imageRootHandle){input.click();return;}
  try{
    if(!(await ensureDirectoryPermission(imageRootHandle))){imageRootHandle=null;updateImageFolderStatus();input.click();return;}
    let start=imageRootHandle;
    if(kind==="logo"){
      // Los logos se buscan SIEMPRE primero en 00_LOGOS_TODOS, donde están todos juntos. Si no existe, usa 00_LOGOS.
      start=imageLogoHandle || await getSubdir(imageRootHandle,["00_LOGOS_TODOS"]) || await getSubdir(imageRootHandle,["00_LOGOS"]) || imageRootHandle;
    }else{
      const p=state.products.find(x=>String(x.id)===String($("productId")?.value||""));
      const company=getEffectiveCompany(p);
      const companyDir=IMAGE_COMPANY_DIR[company] || safeName(company);
      const brand=safeName(getEffectiveBrandForProduct(p));
      start=await getSubdir(imageRootHandle,["01_PRODUCTOS_POR_EMPRESA",companyDir,brand]) || await getSubdir(imageRootHandle,["01_PRODUCTOS_POR_EMPRESA",companyDir]) || await getSubdir(imageRootHandle,["01_PRODUCTOS_POR_EMPRESA"]) || imageRootHandle;
    }
    const [fileHandle]=await window.showOpenFilePicker({startIn:start,excludeAcceptAllOption:true,types:[{description:"Imágenes",accept:{"image/png":[".png"],"image/jpeg":[".jpg",".jpeg"],"image/webp":[".webp"]}}]});
    const file=await fileHandle.getFile();
    const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event("change",{bubbles:true}));
  }catch(e){if(e?.name!=="AbortError") {console.warn("Selector inteligente",e);input.click();}}
}

function bindImageEditor(){
  $("changeImageBtn").onclick = () => pickImageSmart("product");
  $("smartProductImageBtn").onclick = () => pickImageSmart("product");
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
    await persistProductImage(product);
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

function categoryRecordByName(name){const key=categoryKey(canonicalCategoryName(name));return (state.categories||[]).find(c=>categoryKey(canonicalCategoryName(c?.nombre))===key)||null;}
function categoryImageFor(name){return String(categoryRecordByName(name)?.imagen_url||"").trim();}
function categoryImageMarkup(name,cls="category-menu-image"){const url=categoryImageFor(name);return url?`<img class="${cls}" src="${escapeAttr(url)}" alt="${escapeAttr(name)}" loading="lazy">`:`<span class="${cls} category-image-placeholder" aria-hidden="true"></span>`;}
function normalizeCategoryImageName(name){return safeName(name||"categoria").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")||"categoria";}
async function persistCategoryImage(categoryId, categoryName){
  const src=String(state.categoryImageDraft||"").trim();
  if(!src || !src.startsWith("data:image/")) return src;
  if(!categoryId) throw new Error("La categoría necesita un ID antes de guardar su imagen.");
  const safeId=String(categoryId).replace(/[^A-Za-z0-9_-]/g,"");
  const url=await uploadImageDataUrl("imagenes-categorias",`categorias/${safeId}`,"imagen",src);
  state.categoryImageDraft=url;
  return url;
}
function openCategoryModal(id,name=""){if(!isAdmin())return toast("Solo el administrador puede gestionar categorías.");const rec=(state.categories||[]).find(c=>String(c.id)===String(id))||categoryRecordByName(name)||null;state.categoryEditingId=rec?.id??null;state.categoryImageDraft=String(rec?.imagen_url||"");$("categoryModalTitle").textContent=rec?"Editar categoría":"Nueva categoría";$("categoryNameInput").value=rec?.nombre||name||"";$("categoryStatusInput").value=rec?.activo===false?"false":"true";renderCategoryImageDraft();$("categoryModal").classList.remove("hidden");}
function closeCategoryModal(){$("categoryModal").classList.add("hidden");state.categoryEditingId=null;state.categoryImageDraft="";}
function renderCategoryImageDraft(){const box=$("categoryImagePreview");if(!box)return;const url=String(state.categoryImageDraft||"");box.innerHTML=url?`<img src="${escapeAttr(url)}" alt="Vista previa de categoría">`:`<div class="category-image-empty"><span>▧</span><strong>Sin imagen</strong><small>La imagen aparecerá aquí completa</small></div>`;}
function handleCategoryImageFile(e){const file=e.target.files?.[0];if(!file)return;if(!/^image\/(png|jpe?g|webp)$/i.test(file.type))return toast("Usa una imagen PNG, JPG o WEBP.");if(file.size>5*1024*1024)return toast("La imagen supera los 5 MB.");const reader=new FileReader();reader.onload=()=>{state.categoryImageDraft=String(reader.result||"");renderCategoryImageDraft();};reader.readAsDataURL(file);}
async function saveCategoryModal(e){
  e?.preventDefault();
  if(!isAdmin()) return;
  const name=String($("categoryNameInput")?.value||"").trim();
  if(!name) return toast("Escribe el nombre de la categoría.");
  const currentId=state.categoryEditingId;
  const currentRecord=(state.categories||[]).find(c=>String(c.id)===String(currentId));
  const oldName=String(currentRecord?.nombre||"").trim();
  const duplicate=(state.categories||[]).some(c=>String(c.id)!==String(currentId)&&sameCategory(c.nombre,name));
  if(duplicate) return toast("Ya existe una categoría con ese nombre.");
  try{
    const activo=$("categoryStatusInput")?.value!=="false";
    let imageUrl=String(state.categoryImageDraft||"").trim();
    if(CONFIG.demoMode){
      if(currentId){
        const c=state.categories.find(x=>String(x.id)===String(currentId));
        if(c){ c.nombre=name; c.imagen_url=imageUrl; c.activo=activo; }
        if(oldName && oldName.toLowerCase()!==name.toLowerCase()) state.products.forEach(p=>{if(String(p?.categoria||"").trim().toLowerCase()===oldName.toLowerCase()) p.categoria=name;});
      }else{
        const id="cat-"+Date.now();
        state.categories.push({id,nombre:name,imagen_url:"",activo});
        if(imageUrl.startsWith("data:image/")) imageUrl=await persistCategoryImage(id,name);
        const c=state.categories.find(x=>String(x.id)===String(id));
        if(c)c.imagen_url=imageUrl;
      }
    }else{
      if(currentId){
        // La categoría se identifica por ID. El nombre nunca se utiliza para crear carpetas.
        const payload={nombre:name,activo,fecha_actualizacion:new Date().toISOString()};
        if(imageUrl.startsWith("data:image/")) payload.imagen_url=await persistCategoryImage(currentId,name);
        else payload.imagen_url=imageUrl||null;
        await supabaseUpdate("categorias","id=eq."+encodeURIComponent(currentId),payload);

        // Si se renombra una categoría, actualizar también los productos que usaban su nombre.
        // Así no queda una categoría huérfana en el menú y no se crea otra categoría.
        if(oldName && categoryKey(oldName)!==categoryKey(name)){
          const affected=state.products.filter(p=>sameCategory(p?.categoria,oldName));
          for(const p of affected){
            await supabaseUpdate("productos","id=eq."+encodeURIComponent(p.id),{categoria:name});
            p.categoria=name;
          }
        } else if(oldName && sameCategory(oldName,"Arro") && canonicalCategoryName(name)==="Arroz"){
          // Even if the UI considers both names equivalent, repair any old "Arro"
          // product rows when the admin saves this category as "Arroz".
          const affected=state.products.filter(p=>categoryKey(p?.categoria)==="arro");
          for(const p of affected){
            await supabaseUpdate("productos","id=eq."+encodeURIComponent(p.id),{categoria:"Arroz"});
            p.categoria="Arroz";
          }
        }
      }else{
        // Crear primero para obtener un ID estable y recién después subir la imagen.
        const rows=await supabaseInsert("categorias",{nombre:name,imagen_url:null,activo,fecha_actualizacion:new Date().toISOString()});
        const created=Array.isArray(rows)?rows[0]:rows;
        if(created?.id && imageUrl.startsWith("data:image/")){
          imageUrl=await persistCategoryImage(created.id,name);
          await supabaseUpdate("categorias","id=eq."+encodeURIComponent(created.id),{imagen_url:imageUrl,fecha_actualizacion:new Date().toISOString()});
        }
      }
      state.categories=await supabaseGet("categorias","select=id,nombre,imagen_url,fecha_creacion,fecha_actualizacion,activo&order=nombre.asc");
    }
    buildCategories();
    buildAdminProductCategoryFilter();
    renderCatalogAdmin();
    renderCatalog();
    closeCategoryModal();
    toast(currentId?"Categoría actualizada correctamente.":"Categoría creada correctamente.");
  }catch(err){
    console.error(err);
    toast(String(err?.message||"").includes("imagen_url")?"Falta crear el campo imagen_url en Supabase. Ejecuta el SQL incluido en el ZIP.":"No se pudo guardar la categoría.");
  }
}
function filterCategoryAdminNames(){const q=String(state.categorySearch||"").trim().toLowerCase();return getCategoryNames().filter(c=>!q||c.toLowerCase().includes(q));}
function renderCatalogAdmin(){const el=$("catalogAdminList");if(!el)return;const tableCats=(state.categories||[]).filter(c=>String(c?.nombre||"").trim());const names=filterCategoryAdminNames();const total=tableCats.length;const connectionNotice=state.categoryLoadError?`<div class="category-load-warning"><strong>No se pudieron cargar las categorías desde Supabase.</strong><span>Verifica las políticas de lectura de <b>public.categorias</b> y pulsa Actualizar.</span></div>`:"";el.innerHTML=`<div class="category-admin-searchbar"><div class="category-search-box"><span>⌕</span><input id="categoryAdminSearch" type="search" value="${escapeAttr(state.categorySearch||"")}" placeholder="Buscar categoría..." autocomplete="off"></div><div class="category-total-box"><span>▱</span><div><small>Total de categorías</small><strong>${total}</strong></div></div></div>${connectionNotice}<div class="category-admin-table"><div class="category-admin-head"><span>Imagen</span><span>Nombre de la categoría</span><span>Productos</span><span>Estado</span><span>Acciones</span></div>${names.map(c=>{const rec=tableCats.find(x=>sameCategory(x.nombre,c));const displayName=canonicalCategoryName(c);const count=state.products.filter(p=>sameCategory(p?.categoria,displayName)).length;const id=rec?.id??"";return `<div class="category-admin-row"><div class="category-admin-thumb">${categoryImageMarkup(displayName,"category-admin-image")}</div><div class="category-admin-name"><strong>${escapeHtml(displayName)}</strong><span>${count} producto${count===1?"":"s"}</span></div><span class="category-count">${count}</span><span class="category-status ${rec?.activo===false?"inactive":"active"}><i></i>${rec?.activo===false?"Inactiva":"Activa"}</span><div class="category-actions"><button class="category-edit-btn" type="button" data-id="${escapeAttr(id)}" data-name="${escapeAttr(displayName)}" ${rec?"":"disabled"}>✎ Editar</button><button class="category-delete-btn" type="button" data-id="${escapeAttr(id)}" data-name="${escapeAttr(displayName)}" ${rec?"":"disabled"}>▣</button></div></div>`;}).join("")||'<div class="catalog-empty">No hay categorías que coincidan.</div>'}</div>`;const search=$("categoryAdminSearch");if(search){search.oninput=e=>{state.categorySearch=e.target.value;renderCatalogAdmin();const x=$("categoryAdminSearch");if(x){x.focus();x.setSelectionRange(x.value.length,x.value.length);}};}el.querySelectorAll(".category-edit-btn:not(:disabled)").forEach(btn=>btn.onclick=()=>openCategoryModal(btn.dataset.id,btn.dataset.name));el.querySelectorAll(".category-delete-btn:not(:disabled)").forEach(btn=>btn.onclick=()=>deleteCatalog(btn.dataset.id,btn.dataset.name));}
async function syncCategoriesToSupabase(){
  if(!isAdmin()) return toast("Solo el administrador puede sincronizar categorías.");
  const names=getCategoryNames();
  if(!names.length) return toast("No hay categorías para sincronizar.");
  try{
    const existing=state.categories||[];
    const existingNames=new Set(existing.map(c=>String(c.nombre||"").trim().toLowerCase()));
    const missing=names.filter(n=>!existingNames.has(n.toLowerCase()));
    for(const nombre of missing){
      await supabaseInsert("categorias",{nombre});
    }
    state.categories=await supabaseGet("categorias","select=id,nombre,imagen_url,fecha_creacion,fecha_actualizacion,activo&order=nombre.asc");
    buildCategories();
    renderCatalogAdmin();
    toast(missing.length ? `Se registraron ${missing.length} categoría${missing.length===1?"":"s"} en Supabase.` : "Las categorías ya están sincronizadas.");
  }catch(err){
    console.error(err);
    toast("No se pudieron sincronizar las categorías con Supabase.");
  }
}
async function addCatalog(){
  if(!isAdmin()) return toast("Solo el administrador puede agregar categorías.");
  const name=prompt("Nombre de la nueva categoría:");
  const value=String(name||"").trim();
  if(!value) return;
  const all=getCategoryNames();
  if(all.some(x=>x.toLowerCase()===value.toLowerCase())) return toast("Esa categoría ya existe.");
  try{
    if(CONFIG.demoMode){
      state.customCatalogs.push(value);
      localStorage.setItem("sp_custom_catalogs",JSON.stringify(state.customCatalogs));
    }else{
      const rows=await supabaseInsert("categorias",{nombre:value});
      state.categories=[...(state.categories||[]),...(rows||[{nombre:value}])];
    }
    buildCategories(); renderCatalogAdmin();
    toast(`Categoría "${value}" agregada.`);
  }catch(err){console.error(err);toast("No se pudo agregar la categoría en Supabase.");}
}
async function editCatalog(id,name){
  if(!isAdmin()) return toast("Solo el administrador puede editar categorías.");
  const next=prompt("Nuevo nombre de la categoría:",name);
  const value=String(next||"").trim();
  if(!value || value===name) return;
  const all=getCategoryNames().filter(x=>x.toLowerCase()!==name.toLowerCase());
  if(all.some(x=>x.toLowerCase()===value.toLowerCase())) return toast("Ya existe una categoría con ese nombre.");
  try{
    if(id && !CONFIG.demoMode){
      await supabaseUpdate("categorias","id=eq."+encodeURIComponent(id),{nombre:value,fecha_actualizacion:new Date().toISOString()});
    }
    // Mantener productos relacionados con el nombre de la categoría renombrada.
    const affected=state.products.filter(p=>String(p?.categoria||"").trim().toLowerCase()===name.toLowerCase());
    for(const p of affected){
      if(CONFIG.demoMode){ p.categoria=value; }
      else await supabaseUpdate("productos","id=eq."+encodeURIComponent(p.id),{categoria:value});
      p.categoria=value;
    }
    state.categories=CONFIG.demoMode ? (state.categories||[]) : await supabaseGet("categorias","select=id,nombre,imagen_url,fecha_creacion,fecha_actualizacion,activo&order=nombre.asc");
    buildCategories(); buildAdminProductCategoryFilter(); renderCatalog(); renderProductTable(); renderCatalogAdmin();
    toast(`Categoría renombrada a "${value}".`);
  }catch(err){console.error(err);toast("No se pudo editar la categoría.");}
}
async function deleteCatalog(id,name){
  if(!isAdmin()) return toast("Solo el administrador puede eliminar categorías.");
  const count=state.products.filter(p=>String(p?.categoria||"").trim().toLowerCase()===String(name).trim().toLowerCase()).length;
  if(count>0) return toast(`No puedes eliminar "${name}" porque tiene ${count} producto${count===1?"":"s"} asociado${count===1?"":"s"}.`);
  if(!confirm(`¿Eliminar la categoría "${name}"?`)) return;
  try{
    if(id && !CONFIG.demoMode) await supabaseDelete("categorias","id=eq."+encodeURIComponent(id));
    state.categories=(state.categories||[]).filter(c=>String(c.id)!==String(id));
    state.customCatalogs=(state.customCatalogs||[]).filter(x=>x!==name);
    localStorage.setItem("sp_custom_catalogs",JSON.stringify(state.customCatalogs));
    if(state.selectedCategory===name) state.selectedCategory="";
    if(state.adminProductCategory===name) state.adminProductCategory="";
    buildCategories(); buildAdminProductCategoryFilter(); renderCatalog(); renderProductTable(); renderCatalogAdmin();
    toast("Categoría eliminada.");
  }catch(err){console.error(err);toast("No se pudo eliminar la categoría.");}
}

function switchSection(section) {
  if ((section==="productos" || section==="catalogos" || section==="usuarios" || section==="marcas") && !isAdmin()) section="catalogo";
  document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
  $(`${section}Section`).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.section===section));
  const titles={catalogo:["Catálogo de productos","Consulta precios y presentaciones."],productos:["Gestión de productos","Administra productos, precios y presentaciones."],catalogos:["Gestión de catálogos","Administra las categorías de tu catálogo."],marcas:["Nuestros aliados","Administra las empresas que verán los trabajadores."],usuarios:["Gestión de usuarios","Administra las cuentas del sistema."]};
  $("sectionTitle").textContent=titles[section][0];
  $("sectionSubtitle").textContent=titles[section][1];
  if(section==="catalogos"){
    renderCatalogAdmin();
  }
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
window.openProductTextEditor=openProductTextEditor;
window.openProductEditorByCategory=openProductEditorByCategory;
window.deleteProduct=deleteProduct;
window.toggleUser=toggleUser;
