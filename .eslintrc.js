module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'env': {
        'jest': true,
    },
    'rules': {
        'no-use-before-define': 'off',
        'react/jsx-filename-extension': 'off',
        'react/prop-types': 'off',
        'comma-dangle': 'off',
        'semi': [2, 'never'],
        'indent': 'off',
        'react/jsx-indent': 'off',
    },
    'globals': {
        'fetch': false
    }
}