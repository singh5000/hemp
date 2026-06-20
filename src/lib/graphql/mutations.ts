/* ── Cart fragment ───────────────────────────────────────────────── */
export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    total
    subtotal
    totalTax
    shippingTotal
    isEmpty
    contents {
      itemCount
      nodes {
        key
        quantity
        total
        product {
          node {
            databaseId
            name
            slug
            image { sourceUrl altText }
          }
        }
        variation {
          node {
            databaseId
            price
            image { sourceUrl altText }
            attributes { nodes { name value } }
          }
        }
      }
    }
  }
`;

/* ── Auth mutations ──────────────────────────────────────────────── */

/* Requires: WPGraphQL JWT Authentication plugin */
export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password, clientMutationId: "login" }) {
      authToken
      refreshToken
      user {
        databaseId
        name
        email
      }
    }
  }
`;

/* Standard WPGraphQL — no plugin needed */
export const REGISTER_USER_MUTATION = `
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    registerUser(input: {
      clientMutationId: "register"
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    }) {
      user {
        databaseId
        name
        email
      }
    }
  }
`;

/* Requires: wp-graphql-woocommerce plugin */
export const REGISTER_CUSTOMER_MUTATION = `
  mutation RegisterCustomer(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    registerCustomer(input: {
      clientMutationId: "register"
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    }) {
      authToken
      refreshToken
      customer {
        databaseId
        email
        firstName
        lastName
        displayName
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $token, clientMutationId: "refresh" }) {
      authToken
    }
  }
`;

/* ── Customer query ──────────────────────────────────────────────── */
export const GET_CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      databaseId
      firstName
      lastName
      email
      displayName
      billing  { firstName lastName company address1 address2 city state postcode country phone email }
      shipping { firstName lastName company address1 address2 city state postcode country }
      orders(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          databaseId
          orderNumber
          date
          status
          total
          paymentMethodTitle
          lineItems {
            nodes {
              quantity
              total
              product {
                node {
                  name
                  slug
                  image { sourceUrl altText }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ── Cart mutations ──────────────────────────────────────────────── */
export const ADD_TO_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation AddToCart($productId: Int!, $quantity: Int!, $variationId: Int) {
    addToCart(input: {
      clientMutationId: "add"
      productId: $productId
      quantity: $quantity
      variationId: $variationId
    }) {
      cart { ...CartFragment }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation RemoveFromCart($keys: [ID]) {
    removeItemsFromCart(input: { clientMutationId: "remove", keys: $keys }) {
      cart { ...CartFragment }
    }
  }
`;

export const UPDATE_CART_QTY_MUTATION = `
  ${CART_FRAGMENT}
  mutation UpdateCartQty($items: [CartItemQuantityInput]) {
    updateItemQuantities(input: { clientMutationId: "update", items: $items }) {
      cart { ...CartFragment }
    }
  }
`;

export const CLEAR_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation ClearCart {
    emptyCart(input: { clientMutationId: "clear" }) {
      cart { ...CartFragment }
    }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart {
    cart { ...CartFragment }
  }
`;
