import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Puzzlehead from "../components/assets/puzzelhead.png";
import PlantGrowth from "../components/assets/hearflowerhead.png";
import MindBlossom from "../components/assets/blossomhead.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  {
    message: "Piece Together Your Thoughts",
    description: "Sometimes, life feels like a puzzle with a missing piece. Our AI companion is here to help you talk through your thoughts, find clarity, and put those pieces back together. Experience a mind that feels whole again.",
    imagePosition: "right",
    image: Puzzlehead,
  },
  {
    message: "Nurture Your Mental Well-Being",
    description: "Just like a plant needs care to grow, your mind needs nourishment too. Through personalized support and uplifting conversations, our app helps you water your mind with self-love and growth. Watch yourself bloom emotionally and mentally.",
    imagePosition: "left",
    image: PlantGrowth,
  },
  {
    message: "Let Your Mind Blossom",
    description: "The right support can turn a cluttered mind into a flourishing garden. Our platform provides the space and tools you need to cultivate inner peace, allowing your mind to bloom beautifully and fully.",
    imagePosition: "right",
    image: MindBlossom,
  },
];

export function SerenityCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(slides.length);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full h-screen">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <Card className="w-full h-full border-none">
                <CardContent className="flex items-center justify-between p-6 h-full">
                  {slide.imagePosition === "left" && (
                    <div className="w-1/3 h-full relative">
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                       
                      />
                    </div>
                  )}
                  <div className={`w-2/3 px-8 ${slide.imagePosition === "right" ? 'order-first' : ''}`}>
                    <h2 className="text-8xl font-bold mb-4">{slide.message}</h2>
                    <p className="text-2xl">{slide.description}</p>
                  </div>
                  {slide.imagePosition === "right" && (
                    <div className="w-1/3 h-full relative">
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        
                        objectFit="cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 py-2 text-center text-sm text-white bg-black bg-opacity-50 px-4 rounded-full">
        Slide {current + 1} of {count}
      </div>
    </div>
  );
}

export default SerenityCarousel;