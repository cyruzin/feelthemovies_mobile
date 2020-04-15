import React from 'react';
import { View } from 'react-native';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid/v4';

import { Title, Text } from '../UI';

export default function RecommendationHeader (props) {
  const { recommendation, styles } = props;
  const { title, created_at, updated_at, genres, body } = recommendation;
  return (
    <View style={styles.header}>
      <Title style={styles.title}>{title}</Title>
      <View style={styles.dateBox}>
        <Text style={styles.date}>
          Created on {moment(created_at).format('MMMM Do YYYY \\at h:mm a')}
        </Text>
        <Text style={styles.date}>
          Updated on {moment(updated_at).format('MMMM Do YYYY \\at h:mm a')}
        </Text>
      </View>
      <View style={styles.genres}>
        {genres
          .trim()
          .split(', ')
          .map(genre => (
            <View key={uuidv4()} style={styles.genresBox}>
              <Text style={styles.genresText}>{genre}</Text>
            </View>
          ))}
      </View>
      <Text style={styles.description}>{body}</Text>
    </View>
  );
}
