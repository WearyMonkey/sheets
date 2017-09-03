#!/usr/bin/env bash

REPO_DIR=$(git rev-parse --show-toplevel)
BUILD_DIR="${REPO_DIR}/target/build"
DEPLOY_DIR="${REPO_DIR}/target/deploy"

main() {
    source "${REPO_DIR}/bin/aws_creds.sh"
    if [ -d "${DEPLOY_DIR}" ]; then
        rm -r "${DEPLOY_DIR}"
    fi
    cp -r "${BUILD_DIR}" "${DEPLOY_DIR}"
    find "${DEPLOY_DIR}" -type f -exec gzip -9 {} \; -exec mv {}.gz {} \;
    aws s3 sync "${DEPLOY_DIR}" s3://sheets-website --delete --content-encoding 'gzip'
}

main "$@"
