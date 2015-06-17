ntee
====

Portable Unix shell command `tee`, with some extras - read from standard input and write to standard output and files.

## Install

```bash
$ [sudo] npm install -g ntee
```

## Check

```bash
$ ntee --help
```

## Use

```
ntee [OPTIONS] [FILE]

Options:
  -a, --append           append to the given FILEs, do not overwrite
  -s, --suppress         do NOT output to stdout
  -v, --version          Display the current version
  -h, --help             Display help and usage details
```


```bash
$ whoami | ntee file1.txt file2.txt
```

Will print current user to stdout and also to `file1.txt` and `file2.txt`. Note that if these files already existed, they will be overwritten. Use `-a`/`--append` to avoid it, just like you would do with Richard Stallman's `tee`:

```bash
$ whoami | ntee -a i-wont-be-overwritten.txt
```

I added an `-s`/`--suppress` option to suppress output to stdout. This meant to be used on npm scripts:

```bash
$ echo "Nothing will be shown in screen" | ntee -s but-it-will-be-saved-here.txt
```

You can always pipe:

```bash
cat long.log | sort | ntee sorted.log | head
```

## License

[MIT](./README.md) ♥