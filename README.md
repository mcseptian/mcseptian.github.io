Ini adalah blog untuk mencatat belajar coding,...

Mulai dengan perintah:
```sh
git clone ...
cd ...
npm install
npm run dev
```

Buka alamat [localhost:5000](http://localhost:5000) di peramban. 

Ubah komponen di folder `src`, simpan, lalu muat ulang peramban.

_Compile_ ulang untuk publikasi dengan perintah:
```sh
npm run build
```

Bisa dicek dulu di lokal dengan perintah  `npm run start`. 

## Single-page app mode

Kamu bisa merubah script `"start"` di package.json sesuai kebutuhanmu, merubah blog ini menjadi SPA contohnya:
```js
"start": "sirv public --single"
```

_Sirv_ adalah server lokal untuk menampilkan hasil _compile_ blog ini, kamu bisa tambahkan `--host 0.0.0.0` 
setelah perintah sirv untuk cek di lokal.

Biasanya sirv hanya menampilkan file yang ada di folder `public`. Tentu kamu bisa merubahnya menyesuaikan dengan kebutuhanmu.

## Note

If you want to use `baseUrl` or `path` aliases within your `tsconfig`, you need to set up `@rollup/plugin-alias` to tell Rollup to resolve the aliases. For more info, see [this StackOverflow question](https://stackoverflow.com/questions/63427935/setup-tsconfig-path-in-svelte).

Motivation to adopt svelte on my journey to write typescript is this blog [post](https://svelte.dev/blog/svelte-and-typescript)