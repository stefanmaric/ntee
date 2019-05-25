# ntee

Portable Unix shell command `tee`, with some extras — read from standard input and write to standard output and files.

## TL;DR

`gulp.dest()` in middle of a pipe? NPM scripts can do as well:

```json
{
  "scripts": {
    "less": "lessc main.less | postcss --use autoprefixer | ntee main.css | cleancss > main.min.css"
  }
}
```

## Install

```shell
$ npm install -g ntee
```

## Check

```shell
$ ntee --help
```

## Use

```
Usage:
  ntee [OPTION]... FILE...

  Copy standard input to each FILE, and also to standard output.

Options:
  -a, --append              append to the given FILEs, do not overwrite
  -i, --ignore-interrupts   ignore interrupt signals
  -s, --suppress            do not output to stdout
  -v, --version             display the current version
  -h, --help                display help and usage details
```

```shell
$ whoami | ntee file1.txt file2.txt
```

Will print current user to stdout and also to `file1.txt` and `file2.txt`. Note that if these files already exist, they will be overwritten. Use `-a`/`--append` to avoid it, just like you would do with Richard Stallman's `tee`:

```shell
$ whoami | ntee -a i-wont-be-overwritten.txt
```

`-i`/`--ignore-interrupts` will prevent <kbd>CTRL</kbd>+<kbd>C</kbd> from killing `ntee`. Won't work on windows.

I also added an `-s`/`--suppress` option to suppress output to stdout. This meant to be used on npm scripts:

```shell
$ echo "Nothing will be shown in screen" | ntee -s but-it-will-be-saved-here.txt
```

You can always pipe:

```shell
cat long.log | sort | ntee sorted.log | head
```

## License

[MIT](./LICENSE.md) ♥
