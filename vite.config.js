const config = {
  publicDir: 'public',
  base: '/systems/BattleScarredVTT/',
  server: {
    port: 30001,
    open: true,
    proxy: {
      '^(?!/systems/lancer)': 'http://localhost:30000/',
      '/socket.io': {
        target: 'ws://localhost:30000',
        ws: true,
      },
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: 'BattleScarredVTT',
      entry: 'module/BattleScarredVTT.mjs',
      formats: ['es'],
      fileName: 'BattleScarredVTT'
    }
  },
}

export default config;