import React from 'react'
import {
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import IconAnt from 'react-native-vector-icons/AntDesign'

export default (props) => (
    <View style={styles.scrollBox}>
        <TouchableWithoutFeedback
          hitSlop={styles.scrollHitSlop}
          onPress={props.onPress}
        >
            <IconAnt
              name="upcircle"
              color="#737373"
              size={28}
              style={styles.icon}
            />
        </TouchableWithoutFeedback>
    </View>
)

const styles = StyleSheet.create({
    scrollBox: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        zIndex: 1
    },
    scrollHitSlop: {
        top: 5,
        left: 5,
        bottom: 5,
        right: 5
    },
    icon: {
        opacity: 0.8
    }
})
