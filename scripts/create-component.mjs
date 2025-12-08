#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";

const componentTypes = ["atoms", "molecules", "form", "layout", "organisms"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function select(question, options) {
  console.log("\n" + question);

  // Mostrar opciones numeradas
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}. ${opt}`);
  });

  const choice = await ask("\nSelecciona una opción (número): ");

  const index = parseInt(choice, 10) - 1;

  if (isNaN(index) || index < 0 || index >= options.length) {
    console.log("❌ Opción no válida.");
    return await select(question, options); // volver a preguntar
  }

  return options[index];
}

async function parseName(name) {
  return name
    .split(/[\s-_]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

async function run() {
  const componentName = await ask("Nombre del componente: ");
  if (!componentName) {
    console.log("❌ Debes poner un nombre.");
    process.exit(1);
  }

  const componentType = await select(
    "¿De que tipo será este componente??",
    componentTypes
  );

  rl.close();

  const inComponentName = await parseName(componentName);
  const inComponentType = await parseName(componentType);

  const componentPackage = {
    [`${componentName}.tsx`]: `
export const ${inComponentName} = () => {
  return <div>${inComponentName} component</div>;
};
`,
    "index.ts": `
export * from './${componentName}';
`,
  };

  const componentStoryBook = {
    [`${componentName}.stories.ts`]: `
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ${inComponentName} } from "@repo/ui/${componentName}";

export default {
  title: "${inComponentType}/${inComponentName}",
  component: ${inComponentName},
} satisfies Meta<typeof ${inComponentName}>;

export const Primary: StoryObj<typeof ${inComponentName}> = {
  args: {},
};
`,
  };

  const baseComponentPaths = [
    {
      type: "Componente",
      path: path.join("packages", "ui", "src", componentType, componentName),
      component: componentPackage,
    },
    {
      type: "Storybook",
      path: path.join("apps", "docs", "stories", componentType, componentName),
      component: componentStoryBook,
    },
  ];

  baseComponentPaths.forEach((basePath) => {
    if (!fs.existsSync(basePath.path)) {
      fs.mkdirSync(basePath.path, { recursive: true });
    }

    for (const file of Object.keys(basePath.component)) {
      const filePath = path.join(basePath.path, file);
      fs.writeFileSync(filePath, basePath.component[file].trimStart());
    }

    console.log(
      `\n✅ ${basePath.type} "${componentName}" creado en ${basePath.path}`
    );
  });

  // Actualizar package.json con el nuevo export
  const packageJsonPath = path.join("packages", "ui", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Añadir el nuevo export
  if (!packageJson.exports) {
    packageJson.exports = {};
  }

  const exportPath = `./src/${componentType}/${componentName}/index.ts`;
  packageJson.exports[`./${componentName}`] = exportPath;

  // Ordenar los exports alfabéticamente
  const sortedExports = Object.keys(packageJson.exports)
    .sort()
    .reduce((acc, key) => {
      acc[key] = packageJson.exports[key];
      return acc;
    }, {});

  packageJson.exports = sortedExports;

  // Escribir el package.json actualizado con formato bonito
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n"
  );

  console.log(`\n✅ Export añadido a package.json: "./${componentName}"`);
}

run();
