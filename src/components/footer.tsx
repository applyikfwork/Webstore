import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/40 dark:bg-card border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-headline text-primary">MyAppStore</h3>
            <p className="text-muted-foreground max-w-md">
              Discover the latest and greatest apps and websites, curated just for you. The ultimate platform for developers to showcase their latest creations.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold tracking-wider uppercase text-foreground/90">Navigate</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-wider uppercase text-foreground/90">Legal</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} MyAppStore. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
