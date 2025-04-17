import { motion } from 'framer-motion';
import { memo } from 'react';

function FarmFooter() {
    return (
        <footer className="bg-card border-border text-card-foreground border-t py-6">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-primary mb-4 text-lg font-medium">FarmSmart</h3>
                        <p className="text-muted-foreground text-sm">Empowering farmers with the tools they need to succeed.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-card-foreground mb-4 text-sm font-medium">Support</h4>
                        <ul className="space-y-2 text-sm">
                            {['Contact Us'].map((item, idx) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -5 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * idx }}
                                    viewport={{ once: true }}
                                >
                                    <a href="#" className="text-muted-foreground hover:text-foreground group flex items-center transition-colors">
                                        <span className="bg-primary mr-0 h-2 w-0 rounded-full transition-all duration-300 group-hover:mr-2 group-hover:w-1"></span>
                                        {item}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                </div>

                <motion.div
                    className="text-muted-foreground border-border mt-6 border-t pt-6 text-center text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <p>© 2025 FarmSmart. All rights reserved.</p>
                </motion.div>
            </div>
        </footer>
    );
}
export default memo(FarmFooter);
