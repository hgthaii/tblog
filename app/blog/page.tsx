import BlogClient from './BlogClient';
import { getAllCategories, getAllPosts } from '../lib/posts';

export default function BlogPage() {
	const posts = getAllPosts();
	return <BlogClient posts={posts} categories={getAllCategories()} />;
}
