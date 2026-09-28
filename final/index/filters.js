// Sidebar filters for the product listing pages (kurtawomen.html, tshirt.html).
// Builds the BRAND list from the product data and filters by brand, price range and
// minimum discount. Works together with the existing #sort dropdown: sorting reorders the
// product array in place, then the active filters are re-applied.
function setupFilters(products, render) {
  var sidebar = document.getElementById("sidebar_nav");
  if (!sidebar) return;

  var brands = Array.from(new Set(products.map(function (p) { return p.brand; })))
    .sort(function (a, b) { return a.localeCompare(b); });
  var priceRanges = [[0, 500, "Under Rs 500"], [500, 1000, "Rs 500 to Rs 1000"], [1000, Infinity, "Rs 1000 and above"]];
  var discounts = [10, 20, 30, 40, 50];

  function box(group, value, label) {
    return '<label style="display:block;cursor:pointer;margin:4px 0">' +
      '<input type="checkbox" class="check_box" data-group="' + group + '" value="' + value + '"> ' +
      '<span class="brand_space">' + label + '</span></label>';
  }
  function section(title, body) {
    return '<div><br><h5 class="xyz">' + title + '</h5><br>' + body + '<br><hr></div>';
  }

  sidebar.innerHTML =
    section("BRAND", brands.map(function (b) { return box("brand", b, b); }).join("")) +
    section("PRICE", priceRanges.map(function (r, i) { return box("price", i, r[2]); }).join("")) +
    section("DISCOUNT RANGE", discounts.map(function (d) {
      return '<label style="display:block;cursor:pointer;margin:4px 0"><input type="radio" name="discount" class="check_box" data-group="discount" value="' + d + '"> ' +
        '<span class="brand_space">' + d + '% and above</span></label>';
    }).join("") + '<button type="button" id="clear_filters" style="margin-top:10px;border:1px solid #d4d5d9;background:#fff;padding:4px 10px;font-size:12px;cursor:pointer">CLEAR ALL</button>');

  function checked(group) {
    return Array.from(sidebar.querySelectorAll('input[data-group="' + group + '"]:checked'))
      .map(function (el) { return el.value; });
  }

  function apply() {
    var brandSel = checked("brand");
    var priceSel = checked("price").map(Number);
    var minOff = Number(checked("discount")[0] || 0);
    var shown = products.filter(function (p) {
      var price = Number(p.price);
      var inPrice = !priceSel.length || priceSel.some(function (i) {
        return price >= priceRanges[i][0] && price < priceRanges[i][1];
      });
      return (!brandSel.length || brandSel.indexOf(p.brand) !== -1) && inPrice && Number(p.offer) >= minOff;
    });
    render(shown);
    var count = document.getElementById("filter_count");
    if (count) count.textContent = shown.length + " items";
  }

  sidebar.addEventListener("change", apply);
  document.getElementById("clear_filters").addEventListener("click", function () {
    sidebar.querySelectorAll("input").forEach(function (el) { el.checked = false; });
    apply();
  });
  var sort = document.querySelector("#sort");
  if (sort) sort.addEventListener("change", apply);  // runs after the page's own sort handler
}
