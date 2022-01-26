# Audiograph

Explore related artists in a visual network. Uses data from Spotify to populate a network graph.

## Stack/Notes

- React Hooks
- vis.js for visualization
- Interesting workaround because vis.js needs imperative updates while React is an declarative framework
- Hosted with AWS S3 and Cloudfront
- Backend is my other project spotify-network-graph-api (written in Java hosted in ec2)