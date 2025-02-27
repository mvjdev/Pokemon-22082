import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { usePreferences } from '../components/PreferencesContext';
import { useRouter } from 'expo-router';
import { useOrientation } from '../hooks/useOrientation';
import { Settings } from 'lucide-react-native';

type Pokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
};

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = usePreferences();
  const router = useRouter();
  const orientation = useOrientation();
  const { width } = useWindowDimensions();

  const numColumns = orientation === 'LANDSCAPE' ? 4 : 2;

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      const data = await response.json();
      const results = await Promise.all(
        data.results.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );
      setPokemons(results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderPokemonCard = ({ item }: { item: Pokemon }) => {
    const cardWidth = (width - (numColumns + 1) * 16) / numColumns;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            width: cardWidth,
            height: orientation === 'LANDSCAPE' ? 180 : 200
          }
        ]}
        onPress={() => router.push(`/pokemon/${item.id}`)}
      >
        <Image
          source={{ uri: item.sprites.front_default }}
          style={[
            styles.pokemonImage,
            {
              width: orientation === 'LANDSCAPE' ? 80 : 100,
              height: orientation === 'LANDSCAPE' ? 80 : 100
            }
          ]}
        />
        <Text style={[styles.pokemonName, { color: theme.text }]}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loading, { color: theme.text }]}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[
        styles.header,
        orientation === 'LANDSCAPE' && styles.headerLandscape
      ]}>
        <Text style={[
          styles.title,
          { color: theme.text },
          orientation === 'LANDSCAPE' && styles.titleLandscape
        ]}>
          Pokédex
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={styles.settingsButton}
        >
          <Settings color={theme.text} size={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={pokemons}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLandscape: {
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleLandscape: {
    fontSize: 20,
  },
  settingsButton: {
    padding: 8,
  },
  list: {
    padding: 8,
  },
  card: {
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pokemonImage: {
    resizeMode: 'contain',
  },
  pokemonName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
  },
});