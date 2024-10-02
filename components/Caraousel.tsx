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
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    message: "Piece Together Your Thoughts",
    description: "Sometimes, life feels like a puzzle with a missing piece. Our AI companion is here to help you talk through your thoughts, find clarity, and put those pieces back together. Experience a mind that feels whole again.",
    imagePosition: "right",
    image: Puzzlehead,
  },
  {
    // message: "Nurture Your Mental Well-Being",
    message: "Grow Your Inner Strength",
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;

    const totalSlides = slides.length;

    const intervalId = setInterval(() => {
      if (!isPaused) {
        if (current === totalSlides - 1) {
          api.scrollTo(0); // Return to the first slide when reaching the last one
        } else {
          api.scrollNext();
        }
      }
    }, 3000); // Change slide every 5 seconds

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => clearInterval(intervalId);
  }, [api, current, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="w-full h-screen relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <Card className="w-full h-full border-none">
                <CardContent className="flex items-center justify-between p-6 h-full">
                  {slide.imagePosition === "left" && (
                    <div className="w-1/3 h-full pl-20 relative">
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        
                        //layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div
                    className={`w-2/3 px-8 ${slide.imagePosition === "right" ? "order-first" : ""
                      }`}
                  >
                    <h2 className="text-9xl text-green-950 font-bold mb-4">{slide.message}</h2>
                    <p className="text-2xl text-green-900">{slide.description}</p>
                  </div>
                  {slide.imagePosition === "right" && (
                    <div className="w-1/3 h-full relative">
                      <Image
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        //layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
       
      </Carousel>

      {/* Custom Previous Button */}
      <button
        className="absolute left-4 text-green-950 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-4 rounded-full hover:bg-opacity-90 transition-all"
        onClick={() => api && api.scrollPrev()}
      >

        <ChevronLeft />
      </button>
      {/* Custom Next Button */}
      <button
        className="absolute right-4 text-green-950 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 p-4 rounded-full hover:bg-opacity-90 transition-all"
        onClick={() => api && api.scrollNext()}
      >
        <ChevronRight />
      </button>
       {/* Dot Indicators */}
      {/*
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 py-2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full ${current === index ? "bg-gray-600" : "bg-gray-400"
              }`}
            onClick={() => api && api.scrollTo(index)}
          />
        ))}
      </div> */}



    </div>
  );
}

export default SerenityCarousel;
