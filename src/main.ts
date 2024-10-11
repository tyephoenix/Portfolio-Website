import './render/engine'


const navbar = document.getElementById("navbar")

// Color Mapping
const brightCartoonColors = [
  "#FF5733", // Red Orange
  "#FFB300", // Vivid Yellow
  "#75FF33", // Bright Green
  "#33FF57", // Light Green
  "#33B5FF", // Sky Blue
  "#335BFF", // Bright Blue
  "#A333FF", // Bright Purple
  "#FF33B5", // Vivid Pink
  "#FFDA33", // Bright Gold
  "#FF5E33"  // Coral
];
const wordToColor = new Map()
for (var i = 0; i < navbar!.childNodes.length; i++) {
  var child = navbar!.childNodes[i]
  if (child instanceof HTMLElement) {
    if (!wordToColor.has(child.innerText)) {
      wordToColor.set(child.innerText, brightCartoonColors.pop())
    }
    var style = document.createElement("style")
    child.id = child.innerText + "-nav"
    style.textContent = "#" + child.innerText + "-nav:hover {color: " + wordToColor.get(child.innerText) + ";}"
    child.appendChild(style)
  }
}