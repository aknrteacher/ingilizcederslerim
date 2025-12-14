import React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import "@/styles/preschool-button.css";

interface PreschoolButtonProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  href: string;
  gradient?: "yellow-orange" | "blue-purple" | "pink-red" | "green-teal" | "purple-pink";
  className?: string;
  dataTestId?: string;
}

const gradientStyles = {
  "yellow-orange": {
    gradient: "linear-gradient(135deg, #FFE066 0%, #FF8C42 100%)",
    glow: "rgba(255, 224, 102, 0.6)",
    textColor: "#FF6B00",
    shadowColor: "rgba(255, 140, 66, 0.4)",
  },
  "blue-purple": {
    gradient: "linear-gradient(135deg, #6BCEFF 0%, #9B7FFF 100%)",
    glow: "rgba(107, 206, 255, 0.6)",
    textColor: "#4A5FFF",
    shadowColor: "rgba(155, 127, 255, 0.4)",
  },
  "pink-red": {
    gradient: "linear-gradient(135deg, #FFB3D9 0%, #FF6B6B 100%)",
    glow: "rgba(255, 179, 217, 0.6)",
    textColor: "#CC0044",
    shadowColor: "rgba(255, 107, 107, 0.4)",
  },
  "green-teal": {
    gradient: "linear-gradient(135deg, #A8E6CF 0%, #3DD9C7 100%)",
    glow: "rgba(168, 230, 207, 0.6)",
    textColor: "#006B5C",
    shadowColor: "rgba(61, 217, 199, 0.4)",
  },
  "purple-pink": {
    gradient: "linear-gradient(135deg, #C8A8E9 0%, #FF8CC8 100%)",
    glow: "rgba(200, 168, 233, 0.6)",
    textColor: "#7B2CBF",
    shadowColor: "rgba(255, 140, 200, 0.4)",
  },
};

export function PreschoolButton({
  title,
  subtitle,
  description,
  icon,
  href,
  gradient = "yellow-orange",
  className,
  dataTestId,
}: PreschoolButtonProps) {
  const style = gradientStyles[gradient];

  return (
    <Link href={href}>
      <a
        className={cn("preschool-button-link", className)}
        data-testid={dataTestId}
        style={{
          ['--button-glow' as any]: style.glow,
          ['--button-shadow' as any]: style.shadowColor,
        }}
      >
        <div
          className="preschool-button"
          style={{
            background: style.gradient,
            boxShadow: `0 0 30px ${style.glow}, 0 8px 24px ${style.shadowColor}`,
          }}
        >
          {/* Glowing outline effect */}
          <div
            className="preschool-button-glow"
            style={{
              boxShadow: `0 0 20px ${style.glow}, inset 0 0 20px ${style.glow}`,
            }}
          />
          
          {/* Content */}
          <div className="preschool-button-content">
            {icon && (
              <div className="preschool-button-icon">
                {icon}
              </div>
            )}
            <div className="preschool-button-text">
              <h3
                className="preschool-button-title"
                style={{ color: style.textColor }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  className="preschool-button-subtitle"
                  style={{ color: style.textColor }}
                >
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="preschool-button-description">{description}</p>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
