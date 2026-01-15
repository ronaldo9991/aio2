import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page Not Found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="gap-2" data-testid="button-go-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
