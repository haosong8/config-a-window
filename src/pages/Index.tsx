import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Ruler, Palette, Shield, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Ruler,
      title: "Custom Dimensions",
      description: "Specify exact width and height to fit your space perfectly",
    },
    {
      icon: Palette,
      title: "Style Options",
      description: "Choose from various opening types, colors, and grid patterns",
    },
    {
      icon: Shield,
      title: "Premium Features",
      description: "Thermal breaks, double or triple pane glass, and quality hardware",
    },
    {
      icon: Sparkles,
      title: "Professional Grade",
      description: "Industry-leading materials and craftsmanship",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Design Your Perfect Window
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              Create custom windows and doors tailored to your exact specifications. Choose dimensions,
              styles, features, and finishes with our intuitive configurator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <Button
                size="lg"
                onClick={() => navigate("/configure")}
                className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 text-lg px-8 py-6"
              >
                Multi-Step Configurator
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/single-page-configure")}
                className="text-lg px-8 py-6 border-2"
              >
                Single-Page Configurator
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Custom Windows?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every project is unique. Our configurator lets you design windows that match your vision
              perfectly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-accent-warm/50 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent-warm/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent-warm" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-accent-warm/20 bg-surface-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-2">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Design your custom window in minutes with our step-by-step configurator
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button
                size="lg"
                onClick={() => navigate("/configure")}
                className="bg-accent-warm text-accent-warm-foreground hover:bg-accent-warm/90 text-lg px-8 py-6"
              >
                Configure Your Window
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
