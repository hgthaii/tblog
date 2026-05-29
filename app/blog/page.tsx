import BlogClient from './BlogClient';
import { getAllPosts } from '../lib/posts';

export default function BlogPage() {
	const posts = getAllPosts();
	return <BlogClient posts={posts} />;
}
