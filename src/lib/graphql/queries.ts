export const GET_HOMEPAGE = `
  query GetHomepage {
    page(id: "/", idType: URI) {
      title
      content
      seo {
        title
        metaDesc
      }
    }
  }
`;

export const GET_PRODUCTS = `
  query GetProducts($first: Int = 12, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
        }
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_SINGLE_PRODUCT = `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        price
        regularPrice
        variations {
          nodes {
            id
            databaseId
            name
            price
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        metaDesc
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = `
  query GetProductCategories {
    productCategories(first: 20) {
      nodes {
        id
        name
        slug
        count
        image {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_POSTS = `
  query GetPosts($first: Int = 9) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
