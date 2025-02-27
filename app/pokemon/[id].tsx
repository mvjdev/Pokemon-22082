import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { usePreferences } from '../../components/PreferencesContext';
import { useLocalSearchParams } from 'expo-router';
import { useOrientation } from '../../hooks/useOrientation';

type PokemonType = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

export default function PokemonDetail() {
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = usePreferences();
  const { id } = useLocalSearchParams();
  const orientation = useOrientation();

  useEffect(() => {
    fetchPokemonDetails();
  }, []);

  const fetchPokemonDetails = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemon(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading || !pokemon) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const PokemonInfo = () => (
    <>
      <Text style={[styles.name, { color: theme.text }]}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Stats</Text>
      {pokemon.stats.map((stat) => (
        <View key={stat.stat.name} style={styles.statRow}>
          <Text style={[styles.statName, { color: theme.text }]}>
            {stat.stat.name}:
          </Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stat.base_stat}
          </Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Types</Text>
      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <View key={type.type.name} style={styles.typeTag}>
            <Text style={styles.typeText}>
              {type.type.name}
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {orientation === 'LANDSCAPE' ? (
        <View style={styles.landscapeContainer}>
          <View style={styles.landscapeImageContainer}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.imageLandscape}
            />
          </View>
          <View style={styles.landscapeInfoContainer}>
            <PokemonInfo />
          </View>
        </View>
      ) : (
        <>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <PokemonInfo />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landscapeContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  landscapeImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeInfoContainer: {
    flex: 2,
    paddingLeft: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  imageLandscape: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  typeTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    textTransform: 'capitalize',
  },
});