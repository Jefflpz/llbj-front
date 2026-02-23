import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './Breadcrumbs.css';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumbs-list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="breadcrumb-item">
                            {item.path && !isLast ? (
                                <Link to={item.path} className="breadcrumb-link">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`breadcrumb-text ${isLast ? 'active' : ''}`}>
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <ChevronRight className="breadcrumb-separator" size={14} />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
