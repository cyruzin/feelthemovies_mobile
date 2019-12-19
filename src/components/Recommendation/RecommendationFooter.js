import React from 'react';
import {View, Text} from 'react-native';

import uuidv4 from 'uuid/v4';

import {Title} from '../UI';

export default function RecommendationFunction(props) {
  const {recommendation, styles} = props;
  return (
    <View style={styles.keywordsBox}>
      {recommendation.keywords
        .trim()
        .split(', ')
        .map(keywords => (
          <Text key={uuidv4()} style={styles.keywordsText}>
            <Title style={styles.keywordsHashTag}>#</Title>
            {keywords}
          </Text>
        ))}
    </View>
  );
}
