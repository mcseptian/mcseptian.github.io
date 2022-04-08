import path from 'path';
import feather from 'feather-icons/dist/icons.json' assert {type: "json"};
import { pascalCase } from 'pascal-case';
import fs from 'fs-extra';

const handleComponentName = name => name.replace(/\-(\d+)/, '$1')

const component = (icon) =>
  `<script>
  export let size = "100%";
  export let strokeWidth = 2;
  export let fillColor = "currentColor";
  export let strokeColor = "currentColor";
  let customClass = "";
  export { customClass as class };

  if (size !== "100%") {
    size = size.slice(-1) === 'x'
          ? size.slice(0, size.length -1) + 'em'
          : parseInt(size) + 'px';
  }
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fillColor} viewBox="0 0 24 24"  stroke={strokeColor} stroke-width="{strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="feather feather-${icon.name} {customClass}">${feather[icon.name]}</svg>
`

const exporter = (icon) => `export { default as ${icon.pascalCasedComponentName} } from './${icon.pascalCasedComponentName}/${icon.pascalCasedComponentName}.svelte'`

const componentType = (icon) => `/// <reference types="svelte" />\nimport {SvelteComponentTyped} from "svelte/internal"\nexport class ${icon.pascalCasedComponentName} extends SvelteComponentTyped<{size?: string, strokeWidth?: number, fillColor?: string, strokeColor?: string, class?: string}> {}`
const icons = Object.keys(feather).map(name => ({
  name,
  pascalCasedComponentName: pascalCase(`${handleComponentName(name)}-icon`),
  kebabCasedComponentName: `${handleComponentName(name)}-icon`
}))

Promise.all(
icons.map(async (icon) => {
  const filepath = `src/components/icons/${icon.pascalCasedComponentName}`
  const componentPath = `${filepath}/${icon.pascalCasedComponentName}.svelte`
  const typePath = `${filepath}/${icon.pascalCasedComponentName}.svelte.d.ts`
  await fs.ensureDir(path.dirname(componentPath))
    .then(() => {
      fs.writeFile(componentPath, component(icon), 'utf8');
    })

  return fs.ensureDir(path.dirname(typePath))
    .then(() => {
      fs.writeFile(typePath, componentType(icon), 'utf8');
    })
})).then(async () => {
  const main = icons
    .map(icon => exporter(icon))
    .join('\n\n')
  const types = '/// <reference types="svelte" />\nimport {SvelteComponentTyped} from "svelte/internal"\n' +
    icons.map(icon => componentType(icon)).join("\n")
//   await fs.outputFile("src/components/Icons/index.d.ts", types, 'utf8');
  return await fs.outputFile('src/components/icons/index.ts', main, 'utf8')
})
