import React from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';
import moment from 'moment';
import {imgPath} from '../../config/constants';
import {limitChar, routeFix} from '../../util/helpers';
import Title from './Title';
import Text from './Text';
import Badge from './Badge';

export default props => (
  <TouchableWithoutFeedback
    onPress={() =>
      routeFix(props.route, {
        id: props.id,
        type: props.type,
        recommendation: props.recommendation,
      })
    }
    hitSlop={styles.hitSlop}>
    <View style={styles.titleBox}>
      <View style={styles.titleImage}>
        <Image
          style={styles.image}
          source={{
            uri: `${imgPath.W185}${props.image}`,
          }}
        />
        {props.badge ? (
          <Badge style={styles.titleBadge}>
            <Title style={styles.titleBadgeText}>{props.badgeText}</Title>
          </Badge>
        ) : null}
      </View>
      <View style={styles.titleInfo}>
        <Title style={styles.titleInfoText}>{props.title}</Title>

        {props.date !== undefined ? (
          <Text style={styles.titleInfoSubText}>
            {moment(props.date).format('YYYY')}
          </Text>
        ) : null}

        <Text style={styles.titleInfoSubText}>
          {limitChar(props.body, 200, 150)}
        </Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: 'row',
    margin: 10,
  },
  titleImage: {
    position: 'relative',
    width: '30%',
    height: 150,
  },
  titleInfo: {
    width: '70%',
    margin: 5,
    marginLeft: 10,
  },
  titleInfoText: {
    fontSize: 18,
    color: '#fff',
  },
  titleInfoSubText: {
    color: '#737373',
    marginTop: 3,
    fontSize: 16,
  },
  titleBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  titleBadgeText: {
    color: '#fff',
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 150,
    borderWidth: 1,
    borderColor: '#fff',
    resizeMode: 'contain',
  },
  hitSlop: {
    top: 5,
    left: 0,
    bottom: 5,
    right: 0,
  },
});
