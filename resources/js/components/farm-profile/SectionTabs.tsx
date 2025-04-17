import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';

interface SectionTabsProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const SectionTabs: React.FC<SectionTabsProps> = ({ activeSection, onSectionChange }) => {
    return (
        <motion.div
            className="mb-6 flex space-x-2 overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            {['basic', 'photos'].map((section) => (
                <Button
                    key={section}
                    variant={activeSection === section ? 'default' : 'outline'}
                    onClick={() => onSectionChange(section)}
                    className="group relative"
                >
                    <span className="capitalize">{section === 'basic' ? 'Basic Info' : section}</span>
                    {activeSection === section && (
                        <motion.div className="bg-primary absolute bottom-0 left-0 h-1 w-full" layoutId="activeTab" />
                    )}
                </Button>
            ))}
        </motion.div>
    );
};

export default SectionTabs;