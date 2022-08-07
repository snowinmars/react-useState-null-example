set -e

yarn --cwd webpack
yarn --cwd webpack upd
yarn --cwd webpack build

yarn --cwd common-react
yarn --cwd common-react upd
yarn --cwd common-react build

yarn --cwd application
yarn --cwd application upd
yarn --cwd application build
