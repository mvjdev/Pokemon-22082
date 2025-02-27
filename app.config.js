module.exports = {
  expo: {
    name: 'PokemonApp',
    slug: 'PokemonApp',
    version: '1.0.0',
    orientation: 'default',
    userInterfaceStyle: 'automatic',
    scheme: 'pokemonapp',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.pokemonapp'
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.pokemonapp'
    },
    plugins: [
      'expo-router'
    ],
    experiments: {
      tsconfigPaths: true
    },
    newArchEnabled: true,
    extra: {
      disableDevTools: true
    }
  }
};