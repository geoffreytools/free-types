# Architecture

Two constraints put pressure one code in the following way.

## Support for online Typescript playgrounds

Playing with `free-types` in an online TS playground is an important way people interact with the library, generally to learn about higher kinded types as a concept, but these consumers often use a naive type acquisition mechanism.

To support every consumer, we ship a flat, relatively-resolvable, valid, nodenext ESM package.

### Authoring and shipping are decoupled

We author with path aliases and extensionless imports, which is a setup `tsc` does not support for our target, so we use `"moduleResolution": "bundler"` + a `tsc-esm-kit` post-processing pass to make it happen.

### Emit goes to the package root, not a `dist/` folder

This keeps the published paths flat with reachable subfolder paths without an `exports` map. The package.json `files` array is used both by npm and by the post-processing pass to cherry pick the files to transform and publish.

## `free-types-core`

It is a distinct leaf package that `free-types` and other packages (like `ts-spec`, which is used to test `free-types`) depend on to prevent circular dependencies.

The `TypesMap` interface, which can be extended by module augmentation for automatic free types inference, is owned by `free-types-core` and is re-exported from it so that different packages interacting with each-other and potentially using different views of the library (depending on how they are resolved or what version is used) share a single module identity for this interface.