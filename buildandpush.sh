docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SALEOR_API_URL="https://api.exlynatural.com/graphql/" \
  --build-arg NEXT_PUBLIC_STOREFRONT_URL=https://exlynatural.com \
  --build-arg NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel \
  -t lubshad/storefront-exlynatural:latest \
  --load .
docker buildx build \
  --platform linux/arm64 \
  --build-arg NEXT_PUBLIC_SALEOR_API_URL="https://api.exlynatural.com/graphql/" \
  --build-arg NEXT_PUBLIC_STOREFRONT_URL=https://exlynatural.com \
  --build-arg NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel \
  -t lubshad/storefront-exlynatural:latest-arm64 \
  --load .

docker push lubshad/storefront-exlynatural:latest
